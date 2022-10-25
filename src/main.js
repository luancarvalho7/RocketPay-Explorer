import "./css/index.css"
import IMask from "imask"

function updateCCTheme(flag) {
  const ccBgColor01 = document.querySelector(
    "#app > section > div.cc-bg > svg > g:nth-child(1) > ellipse" //PURPLE
  )
  const ccBgColor02 = document.querySelector(
    "#app > section > div.cc-bg > svg > g:nth-child(2) > ellipse" //BLUE1
  )
  const ccBgColor03 = document.querySelector(
    "#app > section > div.cc-bg > svg > g:nth-child(3) > ellipse" //BLUE2
  )
  const ccBgColor04 = document.querySelector(
    "#app > section > div.cc-bg > svg > g:nth-child(4) > path" //BLUE3
  )
  const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

  const ccFlagColors = {
    visa: ["#2D57F2", "#004373"],
    mastercard: ["#FF6240", "#F2B71F"],
    default: ["#323232", "#808080"],
  }

  ccLogo.src = "/cc-" + flag + ".svg"
  ccBgColor01.setAttribute("fill", ccFlagColors[flag][0])
  ccBgColor02.setAttribute("fill", ccFlagColors[flag][1])
  ccBgColor03.setAttribute("fill", ccFlagColors[flag][1])
  ccBgColor04.setAttribute("fill", ccFlagColors[flag][1])
}
globalThis.updateCCTheme = updateCCTheme

const securityCode = document.getElementById("security-code")
const securityCodeOpitions = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodeOpitions)

// DATE
const date = new Date()
const fullYear = date.getFullYear().toString().split("").splice(2, 2)
const yearYY = Number((fullYear[0] += fullYear[1]))
const expirationDate = document.getElementById("expiration-date")
const expirationDateOpitions = {
  mask: "MM/YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: yearYY,
      to: yearYY + 10,
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDateOpitions)

const cardNumber = document.getElementById("card-number")
const cardNumberOpitions = {
  mask: [
    {
      mask: "000 000 000 000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "000 000 000 000",
      regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "000 000 000 000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberOpitions)

//

const addCButton = document.getElementById("addCButton")
addCButton.addEventListener("click", () => {
  alert("Done")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

//
const cardInput = document.getElementById("card-holder")

cardInput.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText =
    cardInput.value.length === 0 ? "SEU NOME" : cardInput.value
  ccHolder.innerText =
    cardInput.value.length > 27 ? compress(cardInput.value) : ccHolder.innerText
})

function compress(input) {
  let inputArray = input.split("")
  let inputCompressed = ""
  for (let i = 0; i < input.length - 27; i++) {
    inputArray.pop()
  }
  for (let i = 0; i < inputArray.length; i++) {
    inputCompressed += inputArray[i]
  }
  return inputCompressed
}

//
securityCodeMasked.on("accept", () => {
  updateDisplayCvc(securityCodeMasked.value)
})
function updateDisplayCvc(value) {
  const cvcHolder = document.querySelector(".cc-security .value")
  cvcHolder.innerText = value.length < 1 ? "123" : value
}
//

cardNumberMasked.on("accept", () => {
  updateDisplayCcNumber(cardNumberMasked.value)
})
function updateDisplayCcNumber(value) {
  const ccnHolder = document.querySelector(".cc-number")
  ccnHolder.innerText = value.length < 1 ? "1234 5678 9012 3456" : value

  const ccCardType = cardNumberMasked.masked.currentMask.cardtype
  updateCCTheme(ccCardType)
}
//
expirationDateMasked.on("accept", () => {
  updateExpDate(expirationDateMasked.value)
})

function updateExpDate(value) {
  const expDateHolder = document.querySelector(".cc-expiration .value")
  expDateHolder.innerText = value < 1 ? "02/32" : value
}
