const waitForSelector = (selector) => {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector))
    }

    const waitForSelectorObserver = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector))
        waitForSelectorObserver.disconnect()
      }
    })

    waitForSelectorObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })
}

let previouslyFirstInTurnOrder = null
const timerObserverCallback = async (mutationsList) => {
  const firstInTurnOrder = await waitForSelector('#initiativewindow .characterlist > li:nth-child(1)').then(element => element.outerHTML)

  mutationsList.forEach(() => {
    if (previouslyFirstInTurnOrder !== firstInTurnOrder) {
      previouslyFirstInTurnOrder = firstInTurnOrder
    }
  })
}

const timerObserver = new MutationObserver(timerObserverCallback)

waitForSelector('.characterlist').then(targetNode => {
  timerObserver.observe(targetNode, { childList: true })
})
