const TIMER_CLASS_STRING = 'roll20-made-easlier-timer'
const TIMER_CLASS = `.${TIMER_CLASS_STRING}`

const TIMER_PREFIX = 'Turn Timer'

let startTime = new Date().getTime()

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

const addTimerToTurnOrder = async (initiativeWindow) => {
  const timerWrapperElement = document.createElement('div')
  timerWrapperElement.setAttribute('class', 'roll20-made-easlier-timer-wrapper ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix')

  const timerElement = document.createElement('span')
  timerElement.setAttribute('id', 'ui-id-9')
  timerElement.setAttribute('class', `${TIMER_CLASS_STRING} ui-dialog-title`)

  const timerTextNode = document.createTextNode(`${TIMER_PREFIX}: Loading...`)

  timerElement.appendChild(timerTextNode)
  timerWrapperElement.appendChild(timerElement)

  const turnOrderWindow = await waitForSelector('.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.initiativedialog.ui-draggable.ui-resizable.ui-dialog-buttons')
  turnOrderWindow.insertBefore(timerWrapperElement, initiativeWindow)
}

let previouslyFirstInTurnOrder = null
const characterListObserverCallback = async (mutationsList) => {
  const firstInTurnOrder = await waitForSelector('#initiativewindow .characterlist > li:nth-child(1)').then(element => element.outerHTML)

  mutationsList.forEach(() => {
    if (previouslyFirstInTurnOrder !== firstInTurnOrder) {
      console.log('roll20-made-easlier detected a new turn')
      previouslyFirstInTurnOrder = firstInTurnOrder
      startTime = new Date().getTime()
    }
  })
}

const characterListObserver = new MutationObserver(characterListObserverCallback)

waitForSelector('#initiativewindow').then(initiativeWindow => addTimerToTurnOrder(initiativeWindow))

waitForSelector('.characterlist').then(characterList => {
  characterListObserver.observe(characterList, { childList: true })
})

waitForSelector(TIMER_CLASS).then(timer => setInterval(() => {
  const now = new Date().getTime()
  const timeElapsed = now - startTime

  const minutes = String(Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60)))
  const seconds = String(Math.floor((timeElapsed % (1000 * 60)) / 1000)).padStart(2, '0')

  timer.innerHTML = `${TIMER_PREFIX} ${minutes}:${seconds}`
}, 1000))
