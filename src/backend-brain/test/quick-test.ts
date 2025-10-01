// Quick Backend Brain Test

import { quickStart } from '../index';

async function quickTest() {
  console.log('🧠 Quick Backend Brain Test\n');

  try {
    // Test 1: Basic Enhancement
    console.log('Test 1: Basic prompt enhancement');
    const input = "Write an email about our new product";
    console.log(`Input: "${input}"`);
    
    const result = await quickStart(input);
    
    console.log(`✅ Success!`);
    console.log(`📊 Quality Score: ${result.qualityScore.toFixed(2)}`);
    console.log(`📈 Enhancement Ratio: ${result.metadata.enhancementRatio.toFixed(2)}x`);
    console.log(`⏱️ Processing Time: ${result.metadata.processingTime}ms`);
    console.log(`🎯 Domain: ${result.provenance.domainSources[0] || 'general'}`);
    
    // Show a preview of the enhanced prompt
    const lines = result.enhancedText.split('\n');
    const preview = lines.slice(0, 10).join('\n');
    console.log(`\n📄 Enhanced Prompt Preview:`);
    console.log('─'.repeat(50));
    console.log(preview);
    if (lines.length > 10) {
      console.log(`... (${lines.length - 10} more lines)`);
    }
    console.log('─'.repeat(50));
    
    // Show why summary
    console.log(`\n💡 Why This Enhancement Works:`);
    const whyLines = result.whySummary.split('\n').slice(0, 5);
    whyLines.forEach(line => {
      if (line.trim()) console.log(line);
    });
    
    console.log(`\n🎉 Backend Brain is working correctly!`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
    return false;
  }
}

// Export for use in other files
export { quickTest };

// Run if called directly
if (require.main === module) {
  quickTest().then(success => {
    process.exit(success ? 0 : 1);
  });
}