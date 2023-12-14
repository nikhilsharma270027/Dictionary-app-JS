let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let notFound = document.querySelector('.not__found');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');
let apikey = 'f5505e6d-4c09-4c96-98de-c742ff55b003';
//when i click on search button the input data must go to server
searchBtn.addEventListener('click', function(e){
    e.preventDefault();
    
    //clear data
    audioBox.innerHTML = '';
    notFound.innerHTML = '';
    defBox.innerHTML = '';
    //Get inputted data
    let word = input.value;
    //call Api get data
    if(word === ''){
        alert('word is required')
        return
    }

    getData(word);
} ) 


async function getData(word){
    loading.style.display = 'block';
    //AJAX call

    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apikey}`)

    const data = await response.json();

    //if empty result
    if (!data.length) {
        loading.style.display = 'none';
        notFound.innerText = " No result found "
        return;
    }


    //if result is suggestions
    if(typeof data[0] === 'string') {
        loading.style.display = 'none';
        let heading = document.createElement('h3');
        heading.innerText = 'Did you mean?';
        notFound.appendChild(heading);
        data.forEach(element => {
            let suggestion = document.createElement('span');
            suggestion.classList.add('suggested');
            suggestion.innerText = element;
            notFound.appendChild(suggestion);
        });
        return;
    }

    //Result found
    loading.style.display = 'none';
    let defination = data[0].shortdef[0];
    defBox.innerText = defination;

    //Sound
    const soundName = data[0].hwi.prs[0].sound.audio;
        if(soundName) {
            //if the audio is available
            renderSound(soundName)
        }


    console.log(data)
}


function renderSound(soundName) {
    // https://media.merriam-webster.com/soundc11
    let subfolder = soundName.charAt(0);
    let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${apikey}`;
    let aud = document.createElement('audio');
    aud.src = soundSrc;
    aud.controls = true;
    audioBox.appendChild(aud);
}