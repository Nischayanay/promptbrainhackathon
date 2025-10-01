# Backend Brain Manual Test Guide

This guide helps you manually test the Backend Brain system to ensure it's working correctly.

## Prerequisites

1. **Database Setup**: Run `supabase db push` to create the schema
2. **Environment Variables**: Set `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
3. **Dependencies**: Ensure all npm packages are installed

## Test 1: Basic Prompt Enhancement

### Input
```
"Write an email about our new product"
```

### Expected Output
- ✅ Processing time < 1500ms
- ✅ Quality score > 0.7
- ✅ Enhancement ratio > 2.0x
- ✅ Domain detected as "marketing"
- ✅ Enhanced prompt includes:
  - Professional email structure
  - Marketing frameworks (AIDA, etc.)
  - Expert vocabulary
  - Specific instructions
  - Examples or templates

### Test Code
```typescript
import { quickStart } from './src/backend-brain';

const result = await quickStart("Write an email about our new product");
console.log('Quality:', result.qualityScore);
console.log('Enhancement:', result.metadata.enhancementRatio + 'x');
console.log('Domain:', result.provenance.domainSources[0]);
```

## Test 2: Domain Detection

Test different domains to ensure proper classification:

| Input | Expected Domain | Test |
|-------|----------------|------|
| "Create a marketing campaign" | marketing | ✅ |
| "Design a user interface" | design | ✅ |
| "Write a Python function" | coding | ✅ |
| "Analyze customer behavior" | psychology | ✅ |
| "Improve business strategy" | business | ✅ |

## Test 3: Credit System

### Setup
1. Create test user: `test-user-123`
2. Add credits: `creditService.addCredits(userId, 10)`

### Test Steps
1. **Check Initial Balance**
   ```typescript
   const credits = await creditService.getUserCredits('test-user-123');
   // Should show 10 credits
   ```

2. **Use Credits for Enhancement**
   ```typescript
   const result = await backendBrain.enhancePrompt("Test prompt", 'test-user-123');
   const newCredits = await creditService.getUserCredits('test-user-123');
   // Should show 9 credits (10 - 1)
   ```

3. **Test Insufficient Credits**
   ```typescript
   // Deduct all credits first
   await creditService.deductCredits('test-user-123', 9);
   
   // This should fail
   try {
     await backendBrain.enhancePrompt("Another prompt", 'test-user-123');
   } catch (error) {
     // Should get INSUFFICIENT_CREDITS error
   }
   ```

## Test 4: Performance Validation

Test with different prompt lengths:

| Prompt Length | Expected Time | Expected Quality |
|---------------|---------------|------------------|
| Short (< 50 chars) | < 800ms | > 0.7 |
| Medium (50-200 chars) | < 1200ms | > 0.75 |
| Long (200+ chars) | < 1500ms | > 0.8 |

## Test 5: Edge Function (Optional)

If using Supabase Edge Functions:

### Test Request
```bash
curl -X POST https://your-project.supabase.co/functions/v1/backend-brain-enhance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "prompt": "Write an email about our new product",
    "userId": "test-user-123"
  }'
```

### Expected Response
```json
{
  "success": true,
  "data": {
    "enhancedText": "# Enhanced Prompt...",
    "qualityScore": 0.87,
    "metadata": {
      "processingTime": 1247,
      "enhancementRatio": 4.2,
      "domainConfidence": 0.91,
      "totalTokens": 342
    }
  }
}
```

## Test 6: Error Handling

Test error scenarios:

1. **Empty Prompt**
   - Input: `""`
   - Expected: `INVALID_INPUT` error

2. **Very Long Prompt**
   - Input: 10,000+ character string
   - Expected: `INPUT_TOO_LONG` error or automatic truncation

3. **Invalid User ID**
   - Input: Non-existent user
   - Expected: System should work (credits optional)

## Success Criteria

✅ **All tests pass with:**
- Processing time < 1500ms
- Quality scores > 0.7
- Enhancement ratios > 2.0x
- Correct domain detection (>80% accuracy)
- Credit system working correctly
- Proper error handling

## Troubleshooting

### Common Issues

1. **"Module not found" errors**
   - Solution: Run `npm install` and ensure TypeScript is compiled

2. **Database connection errors**
   - Solution: Run `supabase db push` and check environment variables

3. **Gemini API errors**
   - Solution: Verify `GEMINI_API_KEY` is set correctly

4. **Slow performance**
   - Check: Database connection latency
   - Check: Network connectivity to Gemini API

### Debug Mode

Enable debug logging:
```typescript
process.env.DEBUG = 'backend-brain:*';
```

## Production Readiness Checklist

- [ ] All manual tests pass
- [ ] Performance meets targets
- [ ] Credit system accurate
- [ ] Error handling robust
- [ ] Database schema deployed
- [ ] Environment variables set
- [ ] Monitoring configured

## Next Steps

Once manual testing is complete:
1. Deploy to staging environment
2. Run automated test suite
3. Monitor performance metrics
4. Collect user feedback
5. Deploy to production

---

**🎉 If all tests pass, your Backend Brain is ready for production!**