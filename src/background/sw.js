// Background service worker for Simagizer
// Handles background tasks and extension lifecycle events

chrome.runtime.onInstalled.addListener(() => {
  console.log('Simagizer extension installed');
});
