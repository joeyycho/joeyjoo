import './guestbook.css';

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('Data').addEventListener('submit', function(event) {
        event.preventDefault();
        const writer = document.getElementById('writerInput').value;
        const password = document.getElementById('passwordInput').value;
        const title = document.getElementById('titleInput').value;
        const content = document.getElementById('contentInput').value;

        const data = {
            title: title,
            content: content,
            writer: writer,
            password: password
        };

        fetch('http://vin-joo-guestbook.o-r.kr:8000/posts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            window.location.reload();
        })
        .catch((error) => console.error('error', error));
    });

    const container = document.getElementById("container");

    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');
    const content = urlParams.get('content');
    const writer = urlParams.get('writer');
    const password = urlParams.get('password');
    const updatedTime = urlParams.get('updated_at');

    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    async function getData() {
        try {
            const response = await fetch("http://vin-joo-guestbook.o-r.kr:8000/posts/");
            const data = await response.json();

            data.forEach(post => {
                const info = document.createElement("div");
                info.innerHTML = `
                <article id="post">
                    <div>
                        <span>제목: ${decodeURIComponent(post.title)}</span><br>
                        <span>내용: ${decodeURIComponent(post.content).replace(/\n/g, '<br>')}</span><br><br>
                        <span class="right"> ${formatDate(post.updated_at)}</span>
                        <span class="right">- ${decodeURIComponent(post.writer)}</span><br>
                        <button onclick="editPost('${post.id}')">수정</button>
                        <button onclick="deletePost('${post.id}', '${post.password}')">삭제</button>
                    </div>
                </article>
                `;
                container.appendChild(info);
            });
        } catch (error) {
            console.error('error', error);
        }
    }

    window.editPost = async function(id) {
        console.log('Editing Post ID:', id);

        const password = prompt("비밀번호를 입력하세요:");
        if (password === null) return; // 사용자가 취소한 경우

        const newContent = prompt("새로운 내용을 입력하세요:");
        if (newContent === null) return; // 사용자가 취소한 경우

        const data = {
            content: newContent,
            password: password
        };

        try {
            const response = await fetch(`http://vin-joo-guestbook.o-r.kr:8000/posts/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const updatedPost = await response.json();
            console.log(updatedPost);

            window.location.reload();
        } catch (error) {
            console.error('error', error);
        }
    }

    window.deletePost = async function(id, correctPassword) {
        console.log('Deleting Post ID:', id);

        const password = prompt("비밀번호를 입력하세요:");
        if (password === null) return; // 사용자가 취소한 경우

        if (password !== correctPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const data = { password: password };
            const response = await fetch(`http://vin-joo-guestbook.o-r.kr:8000/posts/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            window.location.reload();
        } catch (error) {
            console.error('error', error);
        }
    }

    getData();
});
