const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
		'X-RapidAPI-Key': 'c545309271msh2d72c8f7b82f552p122125jsn3df85a77f8da'
	}
};

fetch('https://wordsapiv1.p.rapidapi.com/words/hatchback/typeOf', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));




const getNewWord = () => {
    fetch(
        `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5`,
        {
            method: "GET",
            headers: {
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                "x-rapidapi-key": 'c545309271msh2d72c8f7b82f552p122125jsn3df85a77f8da',
            },
        }
        )
        .then((response) => {
            return response.json();
        })
        .then((res) => {
            word = res.word;
        })
        .catch((err) => {
            console.error(err);
        });
    }
