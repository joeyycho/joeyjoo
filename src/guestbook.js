document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('Data');
    const container = document.getElementById("container");

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const writer = document.getElementById('writerInput').value;
        const password = document.getElementById('passwordInput').value;
        const title = document.getElementById('titleInput').value;
        const content = document.getElementById('contentInput').value;

        const data = { title, content, writer, password };

        try {
            const response = await fetch('http://vin-joo-guestbook.r-e.kr:8000/posts/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();
            console.log(result);
            getData(); // Instead of reloading, get updated data
        } catch (error) {
            console.error('Error:', error);
        }
    });

    function formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }

    async function getData() {
        try {
            const response = await fetch("http://vin-joo-guestbook.r-e.kr:8000/posts/");
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            container.innerHTML = ''; // Clear existing posts
            data.forEach(post => {
                const info = document.createElement("div");
                info.innerHTML = `
                <article id="post-${post.id}">
                    <div>
                        <span>제목: ${post.title}</span><br>
                        <span>내용: ${post.content.replace(/\n/g, '<br>')}</span><br><br>
                        <span class="right"> ${formatDate(post.updated_at)}</span>
                        <span class="right">- ${post.writer}</span><br>
                        <button data-id="${post.id}" class="edit-btn">수정</button>
                        <button data-id="${post.id}" data-password="${post.password}" class="delete-btn">삭제</button>
                    </div>
                </article>
                `;
                container.appendChild(info);
            });

            document.querySelectorAll('.edit-btn').forEach(button =>
                button.addEventListener('click', function() {
                    editPost(this.dataset.id);
                })
            );

            document.querySelectorAll('.delete-btn').forEach(button =>
                button.addEventListener('click', function() {
                    deletePost(this.dataset.id, this.dataset.password);
                })
            );

        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function editPost(id) {
        const password = prompt("비밀번호를 입력하세요:");
        if (!password) return;

        const newContent = prompt("새로운 내용을 입력하세요:");
        if (!newContent) return;

        const data = { content: newContent, password };

        try {
            const response = await fetch(`http://vin-joo-guestbook.r-e.kr:8000/posts/${id}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const updatedPost = await response.json();
            console.log(updatedPost);
            getData(); // Refresh data instead of reloading
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function deletePost(id, correctPassword) {
        const password = prompt("비밀번호를 입력하세요:");
        if (!password) return;

        if (password !== correctPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const data = { password };
            const response = await fetch(`http://vin-joo-guestbook.r-e.kr:8000/posts/${id}/`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            getData(); // Refresh data instead of reloading
        } catch (error) {
            console.error('Error:', error);
        }
    }

    getData();
});
