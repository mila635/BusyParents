/**
 * Test script to validate Make.com blueprint format
 * This script checks if the JSON structure matches Make.com's expected format
 */

const fs = require('fs');
const path = require('path');

// Read the blueprint file
const blueprintPath = path.join(__dirname, 'COMPLETE_MAKE_WORKFLOW.json');

console.log('🔍 Testing Make.com Blueprint Format...');
console.log('=' .repeat(50));

try {
    // Check if file exists
    if (!fs.existsSync(blueprintPath)) {
        console.error('❌ Blueprint file not found:', blueprintPath);
        process.exit(1);
    }

    // Read and parse JSON
    const blueprintContent = fs.readFileSync(blueprintPath, 'utf8');
    const blueprint = JSON.parse(blueprintContent);

    console.log('✅ JSON is valid');
    console.log(`📄 Blueprint name: ${blueprint.name}`);
    console.log(`🔢 Number of modules: ${blueprint.flow ? blueprint.flow.length : 0}`);
    console.log(`🔗 Number of connections: ${blueprint.connections ? blueprint.connections.length : 0}`);

    // Validate required fields
    const requiredFields = ['name', 'flow', 'metadata', 'connections'];
    const missingFields = requiredFields.filter(field => !blueprint[field]);
    
    if (missingFields.length > 0) {
        console.error('❌ Missing required fields:', missingFields.join(', '));
    } else {
        console.log('✅ All required top-level fields present');
    }

    // Validate modules
    if (blueprint.flow && Array.isArray(blueprint.flow)) {
        console.log('\n📋 Module Analysis:');
        blueprint.flow.forEach((module, index) => {
            const moduleNum = index + 1;
            console.log(`  ${moduleNum}. ${module.module || 'Unknown'} (ID: ${module.id})`);
            
            // Check for required module fields
            const requiredModuleFields = ['id', 'module', 'version', 'metadata'];
            const missingModuleFields = requiredModuleFields.filter(field => module[field] === undefined);
            
            if (missingModuleFields.length > 0) {
                console.log(`     ⚠️  Missing fields: ${missingModuleFields.join(', ')}`);
            }
        });
    }

    // Validate connections
    if (blueprint.connections && Array.isArray(blueprint.connections)) {
        console.log('\n🔗 Connection Analysis:');
        blueprint.connections.forEach((conn, index) => {
            console.log(`  ${index + 1}. Module ${conn.module} → ${conn.connection}`);
        });
    }

    // Check for proper module types
    const moduleTypes = blueprint.flow.map(m => m.module);
    const expectedTypes = [
        'gmail:watchEmails',
        'gmail:getEmail', 
        'openai:createChatCompletion',
        'json:parseJSON',
        'util:setVariable',
        'util:router',
        'google-calendar:createEvent',
        'google-sheets:addRow',
        'http:makeARequest'
    ];

    console.log('\n🎯 Module Type Validation:');
    expectedTypes.forEach((expectedType, index) => {
        const actualType = moduleTypes[index];
        if (actualType === expectedType) {
            console.log(`  ✅ Module ${index + 1}: ${actualType}`);
        } else {
            console.log(`  ❌ Module ${index + 1}: Expected '${expectedType}', got '${actualType}'`);
        }
    });

    // Check scheduling
    if (blueprint.scheduling) {
        console.log('\n⏰ Scheduling Configuration:');
        console.log(`  Type: ${blueprint.scheduling.type}`);
        console.log(`  Interval: ${blueprint.scheduling.interval} ${blueprint.scheduling.unit}`);
    }

    // File size check
    const fileSizeKB = Math.round(blueprintContent.length / 1024);
    console.log(`\n📊 Blueprint Statistics:`);
    console.log(`  File size: ${fileSizeKB} KB`);
    console.log(`  Characters: ${blueprintContent.length}`);
    console.log(`  Lines: ${blueprintContent.split('\n').length}`);

    // Final validation
    console.log('\n🎉 Blueprint Validation Results:');
    
    const validationChecks = [
        { name: 'Valid JSON format', passed: true },
        { name: 'Required fields present', passed: missingFields.length === 0 },
        { name: 'Modules configured', passed: blueprint.flow && blueprint.flow.length > 0 },
        { name: 'Connections defined', passed: blueprint.connections && blueprint.connections.length > 0 },
        { name: 'Scheduling configured', passed: !!blueprint.scheduling },
        { name: 'Metadata present', passed: !!blueprint.metadata }
    ];

    validationChecks.forEach(check => {
        console.log(`  ${check.passed ? '✅' : '❌'} ${check.name}`);
    });

    const allPassed = validationChecks.every(check => check.passed);
    
    if (allPassed) {
        console.log('\n🚀 SUCCESS: Blueprint is ready for Make.com import!');
        console.log('\n📋 Next Steps:');
        console.log('  1. Go to Make.com → Create New Scenario');
        console.log('  2. Click 3-dot menu → Import Blueprint');
        console.log('  3. Upload COMPLETE_MAKE_WORKFLOW.json');
        console.log('  4. Connect your Google and OpenAI accounts');
        console.log('  5. Activate the scenario');
    } else {
        console.log('\n⚠️  WARNING: Blueprint may have issues during import');
        console.log('   Consider using manual module creation instead');
    }

} catch (error) {
    console.error('❌ Error validating blueprint:', error.message);
    
    if (error instanceof SyntaxError) {
        console.error('   This appears to be a JSON syntax error.');
        console.error('   Please check the JSON format using an online validator.');
    }
    
    process.exit(1);
}

console.log('\n' + '='.repeat(50));
console.log('✨ Blueprint validation complete!');