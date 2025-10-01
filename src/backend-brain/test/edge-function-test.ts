// Test for Supabase Edge Function

async function testEdgeFunction() {
  console.log('🌐 Testing Supabase Edge Function\n');

  // You would replace this with your actual Supabase project URL
  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
  const functionUrl = `${SUPABASE_URL}/functions/v1/backend-brain-enhance`;

  const testCases = [
    {
      name: "Marketing Prompt",
      payload: {
        prompt: "Write an email about our new product launch",
        userId: "test-user-123",
        options: { includeExamples: true }
      }
    },
    {
      name: "Design Prompt", 
      payload: {
        prompt: "Create a user interface for a mobile app",
        options: { domain: "design" }
      }
    },
    {
      name: "Coding Prompt",
      payload: {
        prompt: "Write a function to sort an array",
        options: { includeExamples: false }
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`🧪 Testing: ${testCase.name}`);
    console.log(`Input: "${testCase.payload.prompt}"`);

    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`
        },
        body: JSON.stringify(testCase.payload)
      });

      const result = await response.json();

      if (result.success) {
        console.log(`✅ Success! Quality: ${result.data.qualityScore.toFixed(2)}, Ratio: ${result.data.metadata.enhancementRatio.toFixed(2)}x`);
        console.log(`⏱️ Processing Time: ${result.data.metadata.processingTime}ms`);
        
        // Show preview
        const preview = result.data.enhancedText.substring(0, 100) + '...';
        console.log(`📄 Preview: ${preview}`);
      } else {
        console.log(`❌ Failed: ${result.error.code} - ${result.error.message}`);
      }

    } catch (error) {
      console.log(`❌ Network Error: ${error.message}`);
    }

    console.log(''); // Empty line between tests
  }

  // Test error cases
  console.log('🚫 Testing Error Cases');
  
  // Empty prompt
  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: "" })
    });
    
    const result = await response.json();
    
    if (!result.success && result.error.code === 'INVALID_INPUT') {
      console.log('✅ Empty prompt correctly rejected');
    } else {
      console.log('❌ Empty prompt should have been rejected');
    }
  } catch (error) {
    console.log(`❌ Error testing empty prompt: ${error.message}`);
  }

  console.log('\n🎯 Edge Function Test Complete');
}

// Export for use in other files
export { testEdgeFunction };

// Run if called directly
if (require.main === module) {
  testEdgeFunction().catch(console.error);
}