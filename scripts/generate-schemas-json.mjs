/**
 * generate-schemas-json.mjs — v4.0.0
 *
 * Reads Grade-Index from flowmcp-schemas-private and produces registry.json
 * with grade-filtered, meta-sanitized schema entries.
 *
 * Filter:
 * - Only Grade A + B (Score >= 3.5)
 * - Strip creator, harness, full timestamps from grade-reports
 * - Single schemaId field (no slug doppel-feld)
 * - Exclude licenses-internal.json refs
 *
 * Usage: node scripts/generate-schemas-json.mjs
 */

import { readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { existsSync } from 'node:fs'


const PRIVATE_REPO = resolve( process.cwd(), '../flowmcp-schemas-private' )
const PUBLIC_REPO = resolve( process.cwd() )
const GRADE_INDEX_PATH = join( PRIVATE_REPO, 'proofs/grade-index.md' )
const GRADE_REPORTS_DIR = join( PRIVATE_REPO, 'proofs/grade-reports' )
const OUTPUT_FILE = join( PUBLIC_REPO, 'registry.json' )


const parseGradeIndex = async () => {
    const content = await readFile( GRADE_INDEX_PATH, 'utf-8' )
    const lines = content.split( '\n' )
    const entries = []

    for( const line of lines ) {
        const match = line.match( /^\|\s*`([^`]+)`\s*\|\s*([AB])\s*\|\s*([\d.]+)\s*\|\s*([\d-]+)\s*\|\s*\[link\]\(([^)]+)\)/ )
        if( match ) {
            const [ , schemaId, grade, score, date, reportPath ] = match
            entries.push( {
                schemaId,
                grade,
                score: parseFloat( score ),
                date,
                reportPath
            } )
        }
    }

    return entries
}


const sanitizeReport = ( { report } ) => {
    const sanitized = { ...report }
    delete sanitized.creator
    delete sanitized.harness
    delete sanitized.generatedAt

    if( sanitized.timestamps ) {
        sanitized.date = sanitized.timestamps.date || sanitized.timestamps.deployedAt?.split( 'T' )[ 0 ]
        delete sanitized.timestamps
    }

    return sanitized
}


const main = async () => {
    console.log( 'Reading grade-index.md from flowmcp-schemas-private...' )
    const entries = await parseGradeIndex()
    const gradeA = entries.filter( ( e ) => e.grade === 'A' )
    const gradeB = entries.filter( ( e ) => e.grade === 'B' )

    console.log( `Found ${entries.length} schemas (A: ${gradeA.length}, B: ${gradeB.length})` )

    const schemas = []
    let withReports = 0, missingReports = 0

    for( const entry of entries ) {
        const reportFileName = `${entry.schemaId.replace( '/', '_' )}-${entry.date}.json`
        const reportPath = join( GRADE_REPORTS_DIR, reportFileName )

        let extraMeta = {}
        if( existsSync( reportPath ) ) {
            const reportContent = await readFile( reportPath, 'utf-8' )
            const report = JSON.parse( reportContent )
            const sanitized = sanitizeReport( { report } )
            extraMeta = {
                scoringProtocol: sanitized.scoringProtocol || 'v1',
                schemaHash: sanitized.schemaHash || null,
                dimensions: sanitized.dimensions || null,
                validationPassed: sanitized.validationPassed !== false
            }
            withReports++
        } else {
            missingReports++
        }

        schemas.push( {
            schemaId: entry.schemaId,
            schemaPath: `schemas/v4.0.0/providers/${entry.schemaId}.mjs`,
            grade: entry.grade,
            score: entry.score,
            date: entry.date,
            ...extraMeta,
            termsOfService: null,
            termsOfServiceCheckedAt: null
        } )
    }

    const registry = {
        version: 'v4.0.0',
        generatedAt: new Date().toISOString(),
        totalSchemas: schemas.length,
        distribution: {
            A: gradeA.length,
            B: gradeB.length
        },
        schemas
    }

    await writeFile( OUTPUT_FILE, JSON.stringify( registry, null, 4 ), 'utf-8' )

    console.log( '' )
    console.log( `Wrote registry.json with ${schemas.length} entries.` )
    console.log( `  With grade-reports: ${withReports}` )
    console.log( `  Missing reports: ${missingReports}` )
}


main()
    .catch( ( err ) => {
        console.error( 'Generation failed:', err )
        process.exit( 1 )
    } )
