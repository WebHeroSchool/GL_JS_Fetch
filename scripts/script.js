const searchInput = document.getElementById('search__input');
const searchButton = document.getElementById('search__button');
const searchError = document.getElementById('search__error');
const githubList = document.getElementById('github__list');
const loader = document.getElementById('loader');
const arrGithubList = [];
const delayGetDate = 3000;
const delayGetUser = 1000;
const loaderTime = Math.max(delayGetDate, delayGetUser);
let date = new Date();
const url = new URL(window.location.href);
let userName = url.searchParams.get("username");

if (userName) {
    searchInput.value = userName;
    getUserInfo(userName);
}

function clickSearchButton() {
    searchError.textContent = '';
    if (searchInput.value == "") {
        return;
    };

    const userName = searchInput.value;

    getUserInfo(userName);
}

function setLoaderActive(duration) {
    githubList.classList.add('blur_active');
    loader.classList.remove('hidden');
    setTimeout(() => {
        githubList.classList.remove('blur_active');
        loader.classList.add('hidden');
    }, duration);
}

/*
async function getUserInfo(userName) {
    await fetch(`https://api.github.com/users/${userName}`)
        .then(response => {
            if (!response.ok) {
                searchError.textContent = '* Информация о пользователе не доступна'
                return;
            }

            return response.json()
        })
        .then(user => {
            if (arrGithubList.includes(user.id) === true) {
                searchError.textContent = '* Профиль уже найден и расположен на доске.';
                return;
            };
            arrGithubList.push(user.id);
            addCard(user);
        })
        .catch((error) => {
            searchError.textContent = `* Информация о пользователе не доступна`
        })
}
*/

function getUserInfo(userName) {
    setLoaderActive(loaderTime);

    const getDate = new Promise((resolve, reject) => {
        setTimeout(() => {
            date ? resolve(date) : reject('Время кончилось :(');
        }, delayGetDate);
    });

    const getUser = new Promise((resolve, reject) => {
        setTimeout(() => {
            fetch(`https://api.github.com/users/${userName}`)
                .then(response => {
                    if (!response.ok) {
                        searchError.textContent = '1 * Информация о пользователе не доступна'
                        return;
                    }

                    return response.json();
                })
                .then(user => {
                    resolve(user);
                })
                .catch((error) => {
                    searchError.textContent = `${error} * Информация о пользователе не доступна`
                })
        }, delayGetUser);
    });

    Promise.all([getDate, getUser])
        .then(([date, user]) => {
            addCard(user, date);
        })
}

function addCard(user, date) {
    if (arrGithubList.includes(user.id) === true) {
        searchError.textContent = '* Профиль уже найден и расположен на доске.';
        return;
    };
    arrGithubList.push(user.id);

    let githubItem = document.createElement('div');
    githubItem.classList.add('github__item');

    let githubHeader = document.createElement('a');
    githubHeader.classList.add('github__header');

    let githubAvatar = document.createElement('div');
    githubAvatar.classList.add('github__avatar');

    let img = document.createElement('img');
    img.alt = "Фото профиля"
    githubAvatar.appendChild(img);

    let githubDescription = document.createElement('div');
    githubDescription.classList.add('github__description');

    let githubProfile = document.createElement('a');
    githubProfile.classList.add('github__profile');
    githubProfile.target = "_blank";
    githubProfile.textContent = "Открыть профиль";

    let githubDate = document.createElement('p');
    githubItem.classList.add('github__date');

    // Заполняем карточку
    githubHeader.textContent = user.name;
    githubHeader.href = user.html_url;
    img.src = user.avatar_url;
    githubDescription.textContent = user.bio;
    githubProfile.href = user.html_url;
    githubDate.textContent = getCorrectDate(date);

    githubItem.appendChild(githubHeader);
    githubItem.appendChild(githubAvatar);
    githubItem.appendChild(githubDescription);
    githubItem.appendChild(githubProfile);
    githubItem.appendChild(githubDate);

    // Добавляем карточку на доску
    githubList.appendChild(githubItem);
}

searchButton.addEventListener('click', clickSearchButton);
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        clickSearchButton();
    }
})

function getCorrectDate(date) {
    return (`${date.getDate()}.${date.getMonth()}.${date.getFullYear()}
    ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`)
}