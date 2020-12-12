const searchInput = document.getElementById('search__input');
const searchButton = document.getElementById('search__button');
const searchError = document.getElementById('search__error');
const githubList = document.getElementById('github__list');
const arrGithubList = [];

function clickSearchButton() {
    searchError.textContent = '';

    if (searchInput.value == "") {
        return;
    };

    const userName = searchInput.value;

    getUserInfo(userName);
}

async function getUserInfo(userName) {
    try {
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
    } catch {
        (error => {
            searchError.textContent = `${error} * Информация о пользователе не доступна`
        })
    }
}

function addCard(user) {
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

    // Заполняем карточку
    githubHeader.textContent = user.name;
    githubHeader.href = user.html_url;
    img.src = user.avatar_url;
    githubDescription.textContent = user.bio;
    githubProfile.href = user.html_url;

    githubItem.appendChild(githubHeader);
    githubItem.appendChild(githubAvatar);
    githubItem.appendChild(githubDescription);
    githubItem.appendChild(githubProfile);

    // Добавляем карточку на доску
    githubList.appendChild(githubItem);
}

searchButton.addEventListener('click', clickSearchButton);
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        clickSearchButton();
    }
})