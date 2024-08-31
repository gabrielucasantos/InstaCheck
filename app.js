// Leitor de nome do arquivo
function updateFileName(inputId, spanId) {
    var input = document.getElementById(inputId);
    var span = document.getElementById(spanId);
    if (input.files.length > 0) {
        span.textContent = input.files[0].name;
    } else {
        span.textContent = "Nenhum arquivo selecionado";
    }
}

function readJSONFile(file, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        callback(JSON.parse(event.target.result));
    };
    reader.readAsText(file);
}

function checkUnfollowers() {
    const followersFile = document.getElementById('followersFile').files[0];
    const followingFile = document.getElementById('followingFile').files[0];

    if (!followersFile || !followingFile) {
        alert('Por favor, carregue ambos os arquivos.');
        return;
    }

    readJSONFile(followersFile, function(followersData) {
        readJSONFile(followingFile, function(followingData) {
            const followers = new Set();
            const following = new Set();

            // Processar dados de seguidores
            followersData.forEach(follower => {
                if (follower.string_list_data) {
                    follower.string_list_data.forEach(data => {
                        followers.add(data.value);
                    });
                }
            });

            // Processar dados dos seguidos
            if (Array.isArray(followingData)) {
                followingData.forEach(data => {
                    if (data.string_list_data) {
                        data.string_list_data.forEach(user => {
                            following.add(user.value);
                        });
                    }
                });
            } else if (followingData.relationships_following) {
                followingData.relationships_following.forEach(data => {
                    if (data.string_list_data) {
                        data.string_list_data.forEach(user => {
                            following.add(user.value);
                        });
                    }
                });
            }

            // Encontre não seguidores
            const nonFollowers = [...following].filter(user => !followers.has(user));

            // Exibir resultados com caixas de seleção
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `<h3>Total de pessoas que não seguem você de volta: ${nonFollowers.length}</h3>`;
            nonFollowers.forEach(user => {
                resultDiv.innerHTML += `
                    <div>
                        <input type="checkbox" id="${user}" name="nonFollower" value="${user}">
                        <label for="${user}">${user}</label>
                    </div>
                `;
            });

            // Mostrar o botão de remoção após os resultados serem exibidos
            document.getElementById('removeButtonContainer').style.display = 'flex';
        });
    });
}

// Função para remover usuários selecionados
function removeSelected() {
    const checkboxes = document.querySelectorAll('input[name="nonFollower"]:checked');
    checkboxes.forEach(checkbox => {
        checkbox.parentElement.remove();
    });
}
