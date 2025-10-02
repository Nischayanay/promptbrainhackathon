# Frontend Integration Test Guide

## 🔍 Issue: Input taken but output shows black screen

The backend is working (confirmed via curl), but the frontend isn't displaying the chat output.

## 🧪 Browser Console Tests

Open your app and press F12 to open DevTools Console. Then:

### Test 1: Check if enhancePrompt is called
1. Enter a prompt: "test"
2. Click "Enhance"
3. Look for: `🔍 DEBUG: Sending request to enhance-prompt`

**If you DON'T see this log:**
- The button click isn't triggering the function
- Check if `onEnhance` prop is correctly passed to PromptConsole

### Test 2: Check API response
Look for these logs in sequence:
```
🔍 DEBUG: Sending request to enhance-prompt
📦 Request body: {mode: "ideate", originalPrompt: "test", flowData: null}
🌐 API URL: https://...
📡 Response status: 200
✅ API Response: {success: true, enhancedPrompt: {...}}
```

**If you see 200 response:**
- Backend is working ✅
- Problem is in state update or rendering

### Test 3: Check state updates
Look for:
```
💬 Adding messages to chat: {userMessage: {...}, assistantMessage: {...}}
💬 Updated chatMessages: [{...}, {...}]
```

**If you DON'T see these logs:**
- State update code isn't executing
- There might be an error before reaching setChatMessages

### Test 4: Check ChatThread rendering
Look for:
```
💬 ChatThread not rendering - chatMessages.length: 0
```

**If chatMessages.length stays 0:**
- State isn't updating
- Check React DevTools → Components → Dashboard2ProRedesigned → State

## 🐛 Common Issues & Fixes

### Issue 1: Credits Check Failing
**Symptom:** No API call made
**Check:** Look for "Insufficient credits" in console
**Fix:** Check `canSpend` value in credits hook

### Issue 2: API Call Fails Silently
**Symptom:** No error shown, no output
**Check:** Network tab for failed requests
**Fix:** Check CORS, API key, or network issues

### Issue 3: State Updates But UI Doesn't Render
**Symptom:** Logs show messages added, but UI blank
**Check:** React DevTools → Components → chatMessages state
**Fix:** 
- Check if ChatThread component has errors
- Verify AnimatePresence isn't blocking render
- Check CSS/styling hiding the content

### Issue 4: Response Format Mismatch
**Symptom:** Error: "No enhanced text in response"
**Check:** Console log of API response structure
**Fix:** Verify backend returns `enhancedPrompt.detailed` or `enhancedPrompt.english`

## 🔧 Quick Fixes to Try

### Fix 1: Simplify ChatThread Rendering
Remove the conditional and always render:

```tsx
{/* Chat Thread - Always visible for debugging */}
<div className="mt-12 max-w-4xl mx-auto">
  <div className="text-text-muted mb-4">
    Messages: {chatMessages.length}
  </div>
  <ChatThread
    messages={chatMessages}
    isLoading={isEnhancing}
    onMessageAction={handleMessageAction}
    onRateMessage={handleRateMessage}
  />
</div>
```

### Fix 2: Add Error Boundary
Wrap ChatThread in error boundary to catch rendering errors:

```tsx
<ErrorBoundary fallback={<div>Chat render error</div>}>
  <ChatThread ... />
</ErrorBoundary>
```

### Fix 3: Force Re-render
Add a key to ChatThread to force re-render:

```tsx
<ChatThread
  key={chatMessages.length}
  messages={chatMessages}
  ...
/>
```

## 📊 Expected Console Output (Working State)

When everything works, you should see:

```
🔍 DEBUG: Sending request to enhance-prompt
📦 Request body: {mode: "ideate", originalPrompt: "test", flowData: null}
🌐 API URL: https://qaugvrsaeydptmsxllcu.supabase.co/functions/v1/make-server-08c24b4c/enhance-prompt
📡 Response status: 200
📡 Response headers: {content-type: "application/json", ...}
✅ API Response: {success: true, enhancedPrompt: {detailed: "...", english: "...", short: "..."}, ...}
💬 Adding messages to chat: {userMessage: {...}, assistantMessage: {...}}
💬 Updated chatMessages: [
  {id: "...-user", type: "user", content: "test", ...},
  {id: "...", type: "assistant", content: "🧠 **Backend Brain Enhanced Prompt**...", ...}
]
```

Then the UI should show:
- User message bubble with "test"
- Assistant message bubble with enhanced prompt
- Credits decreased by 1

## 🆘 If Still Not Working

Share these from browser console:
1. All console logs (copy/paste)
2. Network tab screenshot (showing the enhance-prompt request)
3. React DevTools → Components → Dashboard2ProRedesigned → State → chatMessages value

I'll identify the exact issue immediately.
