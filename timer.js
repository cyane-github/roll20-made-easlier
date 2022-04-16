console.log('a roll20 editor tab is open!')

// When first child of
// class="characterlist ui-sortable"
// changes, reset timer

const waitForSelector = (selector) => {
  console.log('HERE HERE HERE!')

  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      console.log('in 1')
      return resolve(document.querySelector(selector))
    }

    const waitForSelectorObserver = new MutationObserver(mutations => {
      console.log('in 2')

      if (document.querySelector(selector)) {
        console.log('in 3')
        resolve(document.querySelector(selector))
        console.log('in 4')
        waitForSelectorObserver.disconnect()
        console.log('in 5')
      }
    })

    console.log('in 6')

    waitForSelectorObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })
    console.log('in 7')
  })
}

// Select the node that will be observed for mutations
// const targetNode = await waitForSelector('#initiativewindow .characterlist > li:nth-child(1)')
// const [targetNode] = document.getElementsByClassName('characterlist')
// console.log('🚀 ~ file: timer.js ~ line 14 ~ targetNode', targetNode)

// Keep track of who's turn it is
const firstInTurnOrderSelector = '#initiativewindow .characterlist > li:nth-child(1)'
let previouslyFirstInTurnOrder = null

// Callback function to execute when mutations are observed
const timerObserverCallback = async (mutationsList, observer) => {
  console.log('=====')
  // console.log(mutationsList)

  const firstInTurnOrder = await waitForSelector(firstInTurnOrderSelector).then(element => element.outerHTML)
  // specific character in list  #initiativewindow > ul > [data-tokenid="-MqzVOoWGcsm0vIZW9og"]

  // Use traditional 'for loops' for IE 11
  // for (const mutation of mutationsList) {
  mutationsList.forEach(mutation => {
    if (previouslyFirstInTurnOrder !== firstInTurnOrder) {
      console.log('🚀 ~ file: timer.js ~ line 46 ~ previouslyFirstInTurnOrder:\n', previouslyFirstInTurnOrder)
      console.log('🚀 ~ file: timer.js ~ line 61 ~ timerObserverCallback ~ firstInTurnOrder:\n', firstInTurnOrder)
      // console.log('previouslyFirstInTurnOrder !== firstInTurnOrder:', mutation)
      previouslyFirstInTurnOrder = firstInTurnOrder
    } // else if (mutation.type === 'subtree') {
    //   console.log('The subtree was modified.')
    // } else if (mutation.type === 'subtree') {
    //   console.log('The characterData was modified.')
    // }
  })
  console.log('=====')
}

// Options for the observer (which mutations to observe)
const timerObserverConfig = { childList: true }

// Create an observer instance linked to the callback function
const timerObserver = new MutationObserver(timerObserverCallback)

waitForSelector('.characterlist').then(targetNode => {
  console.log('🚀 ~ file: timer.js ~ line 69 ~ waitForSelector ~ targetNode', targetNode)
  // Start observing the target node for configured mutations
  console.log('in 7')

  timerObserver.observe(targetNode, timerObserverConfig)
  console.log('in 8')
})
