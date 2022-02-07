
let formSubmitBtn = document.getElementById("submit_detail");
let enterToPlayForm = document.getElementById('enter_to_play');
let fortuneCookiesWidget = document.getElementById('fortune-cookies-widget');
let fortuneCookiesPopUp = document.getElementById('fortune-cookies-game');
let fortuneCookiesWindow = document.getElementById('fortune-cookies-window');
let overlay = document.getElementById('cookies-bg-overlay');
let bodyCopy = document.getElementById('body-copy');
let closeGameBtn = document.getElementById('close-game');
let fortuneCookiesContainer = document.getElementById("fortune-cookies-container");
let fortuneCookiesImgContainer = document.getElementById('cookies-img-container');
let fortuneCookiesBefore = document.getElementById("fortune-cookies-before");
let fortuneCookiesAfter = document.getElementById("fortune-cookies-after");
let wishes = document.getElementById("wishes");
let discount = document.getElementById("discount")
let allWishes = ['May you be happy and prosperous in all things ','May wealth and treasures follow you everywhere you go','May good fortune adorn you in all ways', 'May all your wishes come true ', 'Wishing you good health, style and grace ', 'Wishing you an abundance of blessings and luck in the new year ','Wishing you lots of love and happiness in the new year'];
let openCookies = document.getElementById("open-fortune-cookies");
let tnc = document.getElementById('tnc');
let continueShopping = document.getElementById("continue-shopping");


//form validation



// widget 

function openGamePopUp(){
    fortuneCookiesPopUp.classList.remove('hide');
  	fortuneCookiesWindow.classList.remove('hide');
  	fortuneCookiesWindow.classList.add('flex-center');
    fortuneCookiesWidget.classList.add('hide');
    overlay.classList.remove('hide');



}

fortuneCookiesWidget.addEventListener('click', openGamePopUp);


// form element and submit

function showGame(){
    openCookies.classList.remove('hide');

    
}
function hideForm(){

    enterToPlayForm.classList.add('hide');
}

function submitForm(){
 
  
//form validation 
let email = document.getElementById('email_address').value;
let firstName = document.getElementById('first_name').value;
let lastName = document.getElementById('last_name').value;

  
     var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://manage.kmail-lists.com/ajax/subscriptions/subscribe",
        "method": "POST",
        "headers": {
          "content-type": "application/x-www-form-urlencoded",
          "cache-control": "no-cache"
        },
        "data": {
          "g": "StbJYB",
          "$fields": "$first_name,$last_name,$source",
          "email": email,
          "$first_name": firstName,
          "$last_name": lastName,
          "$source": "B-Fortune Cookies 2021"
        }
      }
       
      $.ajax(settings).done(function (response) {
        console.log(response);
        setTimeout(hideForm, 500);
        setTimeout(showGame, 700);
        
      });



   
    


}


//function - change cookies image

function afterCookiesOpen(){
    let randomPercentage =  Math.floor(Math.random() * (100) );
	let randomDiscountHigher =  Math.floor(Math.random()* (2 - 0) + 0 );
	let randomDiscountLower =  Math.floor(Math.random() * (5 - 0) + 0);
	let randomWishes = Math.floor(Math.random()* (7));
  	discount.classList.remove('hide');
      bodyCopy.classList.add('hide');
 	 if (randomPercentage >= 0 && randomPercentage <=10 ){
        discount.innerHTML = '$18 off any purchase of $128 or above<br>Use code ‘BFORTUNE18’ at checkout<br> in stores or online';
        discount.classList.add('BFORTUNE18')
    } else if (randomPercentage >= 11 && randomPercentage <= 20 ){
        discount.innerHTML = '$28 off any purchase of $228 or above<br>Use code ‘BFORTUNE28’ at checkout<br> in stores or online';
        discount.classList.add('BFORTUNE28')
    } else if (randomPercentage >= 21 && randomPercentage <= 30 ){
        discount.innerHTML = '$38 off any purchase of $300 and above<br>Use code ’BFORTUNE38’ at checkout<br> in stores or online';
        discount.classList.add('BFORTUNE38')
    } else if (randomPercentage >= 31 && randomPercentage <= 45 ){
        discount.innerHTML = '$8 off any purchase<br>Use code ’BFORTUNE08’ at checkout<br> in stores or online';
        discount.classList.add('BFORTUNE08')
    } else if (randomPercentage >= 46 && randomPercentage <= 70 ){
        discount.innerHTML = '5% off any purchase<br>Use code ‘BFORTUNE5P’ at checkout<br>in stores or online';
        discount.classList.add('BFORTUNE5P')
    } else if (randomPercentage >= 71 && randomPercentage <= 90 ){
        discount.innerHTML = '8% off any purchase<br>Use code ‘BFORTUNE8P’ at checkout <br>in stores or online';
         discount.classList.add('BFORTUNE8P')
    } else {
        discount.innerHTML = '$68 off any purchase of $500 or above<br>Use code ‘BFORTUNE68’ at checkout <br> in stores or online';
         discount.classList.add('BFORTUNE68')
    } 
      
    
    console.log(randomPercentage);
 	fortuneCookiesBefore.classList.add('hide');
  	fortuneCookiesAfter.classList.remove('hide');
 	wishes.innerText = allWishes[randomWishes];
 	fortuneCookiesImgContainer.classList.add('cookies-message'); 
  	fortuneCookiesImgContainer.classList.remove('cookies-before');
    fortuneCookiesBefore.classList.remove('wiggle');
    openCookies.classList.add('hide');
  	tnc.classList.remove('hide');
    continueShopping.classList.remove('hide');
  	
  	
   
    
}

// function - open cookies

function openFortuneCookies(){
   
    fortuneCookiesBefore.classList.add('wiggle');
    setTimeout(afterCookiesOpen,1300);


}

openCookies.addEventListener('click', openFortuneCookies);


// function - continue shopping - close pop up 

function closeGame(){
    
    fortuneCookiesPopUp.classList.add('hide');
    enterToPlayForm.classList.remove('hide');
    openCookies.classList.add('hide');
    continueShopping.classList.add('hide');
    discount.innerHTML = "";
    wishes.innerText = "";
    fortuneCookiesBefore.classList.remove('hide');
    fortuneCookiesAfter.classList.add('hide');
    fortuneCookiesWidget.classList.remove('hide');
    overlay.classList.add('hide');
  	fortuneCookiesWindow.classList.add('hide');
  	fortuneCookiesWindow.classList.remove('flex-center');
 	discount.classList.add('hide');
 	bodyCopy.classList.remove('hide');
 	tnc.classList.add('hide');
	discount.classList.remove('BFORTUNE5P');
 	discount.classList.remove('BFORTUNE8P');
	discount.classList.remove('BFORTUNE08');
  	discount.classList.remove('BFORTUNE18');
  	discount.classList.remove('BFORTUNE28');
  	discount.classList.remove('BFORTUNE38');
  	discount.classList.remove('BFORTUNE68')
}

continueShopping.addEventListener('click', closeGame);
closeGameBtn.addEventListener('click', closeGame);


