let movies = [
    {
        image: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/6CoRTJTmijhBLJTUNoVSUNxZMEI.jpg',
        name: 'סוכני המוסד',
    },
    {
        image: 'https://i.pinimg.com/originals/fd/5e/66/fd5e662dce1a3a8cd192a5952fa64f02.jpg',
        name: 'מועדון הקרבות',
    },
    {
        image: 'https://bst.icons8.com/wp-content/themes/icons8/app/uploads/2019/05/poster-for-movie.png',
        name: 'הארי פוטר',
    },
    {
        image: 'https://www.joblo.com/wp-content/uploads/2023/12/land-of-bad-poster-400x600.jpg',
        name: 'ארץ הרעים',
    },
    {
        image: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/6CoRTJTmijhBLJTUNoVSUNxZMEI.jpg',
        name: 'סוכני המוסד',
    },
    {
        image: 'https://i.pinimg.com/originals/fd/5e/66/fd5e662dce1a3a8cd192a5952fa64f02.jpg',
        name: 'מועדון הקרבות',
    },
    {
        image: 'https://bst.icons8.com/wp-content/themes/icons8/app/uploads/2019/05/poster-for-movie.png',
        name: 'הארי פוטר',
    },
    {
        image: 'https://www.joblo.com/wp-content/uploads/2023/12/land-of-bad-poster-400x600.jpg',
        name: 'ארץ הרעים',
    },
]

let container = document.getElementById('container')

for (let i = 0; i < movies.length; i++) {
    container.innerHTML += `
        <div class="movie">
            <img src="${movies[i].image}">
            <p>${movies[i].name}</p>
        </div>
    `
}
