//Main Variables
let ledNewAdvice = document.querySelector(".advice-app .another-advice");
let savedAdviceDiv = document.querySelector(".advice-app .saved-advices");
let ribbonSave = document.querySelector(".advice-app .current-advice span");

//Satrt get advice first time
getAdvice();

createAllLocalStorageAdvices();

function getAdvice() {
  //Get New Advice Function
  let xhr = new XMLHttpRequest();
  xhr.open("GET", `https://api.adviceslip.com/advice`);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        //find file
        let newAdvice = JSON.parse(xhr.responseText);
        createNewAdvice(newAdvice.slip);
        window.localStorage.getItem(newAdvice.slip.id) != null
          ? //in local storage
            document
              .querySelector(".advice-app .current-advice .save")
              .classList.add("saved")
          : //not in local storage
            document
              .querySelector(".advice-app .current-advice .save")
              .classList.remove("saved");
      }
    }
  };
}

ledNewAdvice.onclick = function () {
  getAdvice();
};

//add to local storage new advice
ribbonSave.onclick = function () {
  let currentAdviceId = document.querySelector(
    ".advice-app .current-advice .advice-num"
  );
  let currentAdviceText = document.querySelector(
    ".advice-app .current-advice p"
  );
  //saved before
  // reomve class saved / remove from local storage / remove from div advices
  if (this.classList.contains("saved")) {
    this.classList.remove("saved");
    document
      .querySelector(
        `.advice-app .saved-advices .ID-${currentAdviceId.textContent}`
      )
      .remove();
    window.localStorage.removeItem(currentAdviceId.textContent);
  } else {
    //add class saved / add to local storage / add to div advices
    this.classList.add("saved");
    window.localStorage.setItem(
      currentAdviceId.textContent,
      currentAdviceText.textContent
    );
    createSavedAdvices(currentAdviceId.textContent);
  }

  // window.location.reload();
};

function createAllLocalStorageAdvices() {
  let advicesArr = Object.keys(localStorage);
  for (let i = 0; i < advicesArr.length; i++) createSavedAdvices(advicesArr[i]);
}

function createNewAdvice(newAdvice) {
  document.querySelector(
    ".advice-app .current-advice .advice-num"
  ).textContent = newAdvice.id;
  document.querySelector(".advice-app .current-advice p").textContent =
    newAdvice.advice;
}

function createSavedAdvices(savedAdviceId) {
  let advice = document.createElement("div");
  advice.classList = `advice ID-${savedAdviceId}`;
  //create ribbon
  let spn = document.createElement("span");
  spn.classList = "save saved";
  let icn = document.createElement("i");
  icn.classList = "fa-solid fa-bookmark";
  spn.appendChild(icn);
  spn.onclick = function () {
    //check for the current advice also to be remove save ribon from it important
    if (
      document.querySelector(".advice-app .current-advice h2 span")
        .textContent == this.parentNode.classList[1].split("-")[1]
    )
      document
        .querySelector(".advice-app .current-advice .save")
        .classList.remove("saved");

    //reomve from local storage
    window.localStorage.removeItem(this.parentNode.classList[1].split("-")[1]);
    this.parentNode.remove();
  };
  //create advice header
  let h2 = document.createElement("h2");
  h2.classList = "head-advice";
  h2.textContent = "ADVICE";
  let num = document.createElement("span");
  num.classList = "advice-num";
  num.textContent = savedAdviceId;
  h2.appendChild(num);
  //create advice text
  let quote = document.createElement("p");
  quote.textContent = window.localStorage.getItem(savedAdviceId);
  //append childs
  advice.append(spn, h2, quote);
  savedAdviceDiv.appendChild(advice);
}
