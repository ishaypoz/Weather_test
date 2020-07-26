function fetchToDB() {
	fetch('/postDB', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			city: document.getElementById('city').textContent,
			temp_min: document.getElementsByTagName('span')[1].textContent,
			temp_max: document.getElementsByTagName('span')[2].textContent,
			date_time: document.getElementsByTagName('span')[0].textContent,
			wind: document.getElementsByTagName('span')[3].textContent
		})
	}).then((res) => console.log('Weather Modified in Database'));
}
