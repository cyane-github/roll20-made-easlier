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

// <div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix"><span id="ui-id-9" class="ui-dialog-title">Turn timer 1:06</span></div>

let previouslyFirstInTurnOrder = null
const characterListObserverCallback = async (mutationsList) => {
  const firstInTurnOrder = await waitForSelector('#initiativewindow .characterlist > li:nth-child(1)').then(element => element.outerHTML)

  mutationsList.forEach(() => {
    if (previouslyFirstInTurnOrder !== firstInTurnOrder) {
      console.log('roll20-made-easlier detected a new turn')
      previouslyFirstInTurnOrder = firstInTurnOrder
    }
  })
}

const characterListObserver = new MutationObserver(characterListObserverCallback)

waitForSelector('#initiativewindow').then(async initiativeWindow => {
  const timerWrapperElement = document.createElement('div')
  timerWrapperElement.setAttribute('class', 'roll20-made-easlier-timer-wrapper ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix')

  const timerElement = document.createElement('span')
  timerElement.setAttribute('id', 'ui-id-9')
  timerElement.setAttribute('class', 'roll20-made-easlier-timer ui-dialog-title')

  const timerTextNode = document.createTextNode('Turn timer 00:00')

  timerElement.appendChild(timerTextNode)
  timerWrapperElement.appendChild(timerElement)

  const turnOrderWindow = await waitForSelector('.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.initiativedialog.ui-draggable.ui-resizable.ui-dialog-buttons')
  turnOrderWindow.insertBefore(timerWrapperElement, initiativeWindow)
})

waitForSelector('.characterlist').then(characterList => {
  characterListObserver.observe(characterList, { childList: true })
})

// TODO: Add round number and in-game timer. E.g. "Round: 7 (1m 06s)"
// TODO: Add in-game timer. E.g. "In-game time: 6 * (number of rounds)"
