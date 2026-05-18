/**
 * mirror-from-private.mjs
 *
 * MANUAL mirror tool — copies Grade A+B schemas from flowmcp-schemas-private
 * to flowmcp-schemas-public/schemas/v4.0.0/providers/.
 *
 * Usage:
 *   npm run mirror:dry       # Dry-run, no file writes
 *   npm run mirror           # With confirmation prompt
 *
 * Memo 038 — MANUAL ONLY. Never automated. No fake keys. licenses-internal.json excluded.
 */

import { readdir, readFile, writeFile, mkdir, copyFile, stat } from 'node:fs/promises'
import { join, resolve, dirname, relative } from 'node:path'
import { existsSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'


const PRIVATE_REPO = resolve( process.cwd(), '../flowmcp-schemas-private' )
const PUBLIC_REPO = resolve( process.cwd() )
const GRADE_INDEX = 'proofs/grade-index.md'
const PRIVATE_SCHEMAS_DIR = 'schemas/v4.0.0/providers'
const PUBLIC_TARGET_DIR = 'schemas/v4.0.0/providers'

const EXCLUDE_FILES = new Set( [
    'licenses-internal.json',
    'docs/LICENSES-INTERNAL.md'
] )


const parseGradeIndex = async () => {
    const indexPath = join( PRIVATE_REPO, GRADE_INDEX )
    if( !existsSync( indexPath ) ) {
        throw new Error( `Grade-Index not found: ${indexPath}` )
    }

    const content = await readFile( indexPath, 'utf-8' )
    const lines = content.split( '\n' )
    const schemas = []

    for( const line of lines ) {
        // Format: | `namespace/file` | A | 4.5 | 2026-05-18 | [link](...) |
        const match = line.match( /^\|\s*`([^`]+)`\s*\|\s*([AB])\s*\|\s*([\d.]+)\s*\|\s*([\d-]+)\s*\|/ )
        if( match ) {
            const [ , schemaId, grade, score, date ] = match
            const schemaPath = `schemas/v4.0.0/providers/${schemaId}.mjs`
            schemas.push( {
                schemaId,
                grade,
                score: parseFloat( score ),
                date,
                schemaPath
            } )
        }
    }

    return schemas
}


const copySchema = async ( { schemaPath, dryRun } ) => {
    const sourcePath = join( PRIVATE_REPO, schemaPath )
    if( !existsSync( sourcePath ) ) {
        return { schemaPath, status: 'missing' }
    }

    // Compute relative path under v4.0.0/providers/
    const providersIdx = schemaPath.indexOf( 'v4.0.0/providers/' )
    if( providersIdx === -1 ) {
        return { schemaPath, status: 'wrong-path' }
    }
    const relPath = schemaPath.slice( providersIdx + 'v4.0.0/providers/'.length )
    const targetPath = join( PUBLIC_REPO, PUBLIC_TARGET_DIR, relPath )

    if( dryRun ) {
        return { schemaPath, status: 'would-copy', targetPath }
    }

    await mkdir( dirname( targetPath ), { recursive: true } )
    await copyFile( sourcePath, targetPath )
    return { schemaPath, status: 'copied', targetPath }
}


const confirm = async ( { question } ) => {
    const rl = createInterface( { input: process.stdin, output: process.stdout } )
    const answer = await rl.question( question + ' (y/N) ' )
    rl.close()
    return answer.toLowerCase() === 'y'
}


const main = async () => {
    const dryRun = process.argv.includes( '--dry-run' )

    console.log( '=== Mirror from Private ===' )
    console.log( `Private repo: ${PRIVATE_REPO}` )
    console.log( `Public repo: ${PUBLIC_REPO}` )
    console.log( `Mode: ${dryRun ? 'DRY-RUN' : 'LIVE'}` )
    console.log( '' )

    const schemas = await parseGradeIndex()
    const gradeA = schemas.filter( ( s ) => s.grade === 'A' )
    const gradeB = schemas.filter( ( s ) => s.grade === 'B' )

    console.log( `Found in Grade-Index:` )
    console.log( `  Grade A: ${gradeA.length}` )
    console.log( `  Grade B: ${gradeB.length}` )
    console.log( `  Total:   ${schemas.length}` )
    console.log( '' )

    if( !dryRun ) {
        const ok = await confirm( { question: `Mirror ${schemas.length} schemas from Private to Public?` } )
        if( !ok ) {
            console.log( 'Aborted.' )
            process.exit( 0 )
        }
    }

    let copied = 0, missing = 0, wrongPath = 0
    const sampleMissing = []

    for( const schema of schemas ) {
        const result = await copySchema( { schemaPath: schema.schemaPath, dryRun } )
        if( result.status === 'copied' || result.status === 'would-copy' ) {
            copied++
        } else if( result.status === 'missing' ) {
            missing++
            if( sampleMissing.length < 5 ) { sampleMissing.push( schema.schemaPath ) }
        } else if( result.status === 'wrong-path' ) {
            wrongPath++
        }
    }

    console.log( '' )
    console.log( '=== Result ===' )
    console.log( `${dryRun ? 'Would copy' : 'Copied'}: ${copied}` )
    if( missing > 0 ) {
        console.log( `Missing (path not found): ${missing}` )
        console.log( `Sample: ${sampleMissing.join( ', ' )}` )
    }
    if( wrongPath > 0 ) {
        console.log( `Wrong-path (no v4.0.0/providers/): ${wrongPath}` )
    }

    process.exit( 0 )
}


main()
    .catch( ( err ) => {
        console.error( 'Mirror failed:', err.message )
        process.exit( 1 )
    } )
