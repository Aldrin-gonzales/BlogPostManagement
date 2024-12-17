//fetch('https://jsonplaceholder.typicode.com/users/1')
//.then(response => response.json())
//.then(data => console.log(data))
//.catch(error => console.log('Fetch error: ', error))

const button = document.getElementById('fetchDataBtn');
button.addEventListener('click', async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const data = await response.json();

        // Clear the current list before adding new data
        const dataList = document.getElementById('dataList');
        dataList.innerHTML = '';

        // Add all posts to the list
        data.forEach(post => {
            addDataToList(post);
        });

        console.log('Fetched and displayed posts:', data);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
});

const titleInput = document.getElementById('title')
const bodyInput = document.getElementById('body')
const form = document.getElementById('dataForm')

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form from reloading the page
    const title = titleInput.value;
    const body = bodyInput.value;
    //Payload
    const newData = { title, body, userId: 1 };
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        addDataToList(data);

        // Clear the input fields after adding data 
        titleInput.value = ''; 
        bodyInput.value = '';
        
    } catch (error) {
        console.error('Failed to add new data ', error);
    } s
});


function addDataToList(data) {
    const dataList = document.getElementById('dataList');
    const listItem = document.createElement('li');
    listItem.id = `post-${data.id}`;
    listItem.innerHTML = `
                <div class="post-actions">
                    <button class="btn-edit" onclick="handleEdit(${data.id})">Edit</button>
                    <button class="btn-delete" onclick="handleDelete(${data.id})">Delete</button>
                </div>
                <div class="post-content">
                    <strong> ${data.title}</strong> <br>
                    <span class="span-content">Content:</span> ${data.body}
                </div>
                
            `;
    dataList.appendChild(listItem);
}

// To Edit Post
async function handleEdit(id) {
    const title = prompt('Enter new title:');
    const body = prompt('Enter new body:');

    if (title && body) {
        const updatedData = { id, title, body, userId: 1 };

        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            //para hindi maglimit sa 100 posts only, and pwede mo pa e edit ang post kahit lagpas 100 na.
            if (response.ok || response.status === 500) {
                const listItem = document.getElementById(`post-${id}`);
                listItem.querySelector('.post-content').innerHTML = `
                            <strong>Title:</strong> ${updatedData.title} <br>
                            <strong>Body:</strong> ${updatedData.body}
                        `;
                console.log('Simulated post update:', updatedData);
            }

            if (!response.ok) {
                throw new Error(`Failed to update post: ${response.status}`);
            }

            const updatedPost = await response.json();
            const listItem = document.getElementById(`post-${id}`);

            listItem.querySelector('.post-content').innerHTML = `
                        <strong>Title:</strong> ${updatedPost.title} <br>
                        <strong>Body:</strong> ${updatedPost.body}
                    `;

            console.log('Post updated:', updatedPost);
        } catch (error) {
            console.error('Error updating post:', error);
        }
    }
}


// To Delete Post
async function handleDelete(id) {
    const confirmation = confirm('Are you sure you want to delete this post?');
    if (confirmation) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`Failed to delete post: ${response.status}`);
            }
            console.log(`Post with ID ${id} deleted.`);

            // Remove from UI
            document.getElementById(`post-${id}`).remove();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    }
}