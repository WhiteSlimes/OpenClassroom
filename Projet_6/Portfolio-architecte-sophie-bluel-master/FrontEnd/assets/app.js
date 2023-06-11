let projects = [];
let projectsCache = null;

function fetchProjets(){
    if(projectsCache !== null){
        return Promise.resolve(projectsCache);
    }
    return fetch("http://localhost:5678/api/works")
        .then(response => {
            try {
                return response.json();
            } catch (error) {
                console.error("Error parsing JSON:", error);
                throw error;
            }
        })
        .then(data => {
            projectsCache = data;
            projects = data;
            return projectsCache;
        })
        .catch(error => console.log('Erreur : ' + error));
}

fetchProjets().then(data => {
    projects = data;
    displayProjects(projects);
    createCategoryMenu(projects);
});

function displayProjects(projects) {
    const gallery = document.querySelector(".gallery");
    if(gallery){
        gallery.innerHTML = '';

        projects.forEach(project => {
            const projectElement = document.createElement("figure");
            projectElement.className = "project"

            projectElement.innerHTML = `
                <img src="${project.imageUrl}" alt="${project.title}">
                <figcaption>${project.title}</figcaption>`;

            gallery.appendChild(projectElement);
        });
    }
}

function createCategoryMenu(projects) {
    let categories = new Set();
    projects.forEach(project => categories.add(project.category.name));

    const categoryMenu = document.getElementById("categoryMenu");
    if (categoryMenu){
        categories.forEach(category => {
            const button = document.createElement("button");
            button.className = "button";
            button.textContent = category;
            button.addEventListener("click", function() {
                document.querySelectorAll('.button').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                filterProjects(category);
            });
            categoryMenu.appendChild(button);
        });
        // Ajoutez une option pour afficher tous les projets
        const allButton = document.createElement("button");
        allButton.className = "button";
        allButton.textContent = "Tous";
        allButton.addEventListener("click", function() {
            document.querySelectorAll('.button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            displayProjects(projects);
    
        });
categoryMenu.appendChild(allButton);
    }
}

function filterProjects(category){
    const filteredProjects = projects.filter(project => project.category.name === category);
    displayProjects(filteredProjects);
}

//Partie Login

document.addEventListener("DOMContentLoaded", function(){
    const loginForm = document.getElementById('loginForm');
    if(loginForm){
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
        
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
        
            fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            })
            .then(response => response.json())
            .then(data => {
                if(data.token){
                    localStorage.setItem('token', data.token);
                    window.location.href = "index.html";
                }else {
                    document.getElementById('errorMessage').innerHTML = 'Erreur dans l’identifiant ou le mot de passe';
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
});

let loginButton = document.getElementById("loginButton");
let logoutButton = document.getElementById("logoutButton");
let editModeBanner = document.getElementById("editModeBanner");
let modal = document.getElementById("myModal");
let addProjectModal = document.getElementById('addProjectModal')
let openModalButton = document.getElementById("openModalButton");
let span = document.getElementById("closeModalButton");
let header= document.getElementById("header");
let modifButton = document.getElementsByClassName("modifButton");

// Vérifie si le token existe dans le localStorage
if(localStorage.getItem('token')){
    // Si oui, on passe en mode édition
    editModeBanner.style.display = "block";
    loginButton.style.display = "none";
    logoutButton.style.display = "block";
    openModalButton.style.display = "block";
    header.style.marginTop = 38 + 'px';
    for (let i = 0; i < modifButton.length; i++){
        modifButton[i].style.display = "flex";
    }
}
if(logoutButton){
    logoutButton.onclick = function() {
        // Supprime le token du localStorage
        localStorage.removeItem('token');
    
        // On repasse en mode normal
        loginButton.style.display = "block";
        logoutButton.style.display = "none";
        openModalButton.style.display = "none";
        editModeBanner.style.display = "none";
        modifButton.style.display = "none";
        for (let i = 0; i < modifButton.length; i++){
            modifButton[i].style.display = "none";
        }
    }
}

function  openModal(){
    const modalContent = document.querySelector(".modal-content-img");
    modalContent.innerHTML = '';

    fetchProjets().then(projects => {
        projects.forEach(project => {
            const projectElement = document.createElement("div");
            projectElement.className = "modal-project";
            projectElement.dataset.id = project.id;

            projectElement.innerHTML = `
                <div class="project-image-container">
                    <img src="${project.imageUrl}" alt="${project.title}">
                    <i class="fa-solid fa-trash-can" data-id="${project.id}"></i>
                </div>
                <figcaption><span class="edit-text" data-edit-id="${project.id}">éditer</span></figcaption>`;
                    
            modalContent.appendChild(projectElement);

            const trashCanIcon = projectElement.querySelector('.fa-trash-can');
            trashCanIcon.addEventListener('click', function(event){
                const projectId = event.target.dataset.id;
                try {
                    deleteProject(projectId).then(() => {
                        projectElement.remove();
                    });
                } catch (error) {
                    console.error('Error while trying to delete project and update the DOM:', error);
                }
            });
        });
    });
    const modal = document.querySelector(".modal");
    modal.style.display = "block"
}

let openModalButtonElement = document.querySelector("#openModalButton");

if (openModalButtonElement){
    document.querySelector("#openModalButton").addEventListener("click", openModal);
}

if(span){
    span.onclick = function() {
        modal.style.display = "none";
        addProjectModal.style.display = "none"
    }  
}

window.onclick = function(event) {
    if (event.target == modal || event.target == addProjectModal) {
        modal.style.display = "none";
        addProjectModal.style.display = "none";
    }
}

function deleteProject(projectId) {
    return fetch('http://localhost:5678/api/works/' + projectId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression : ' + response.statusText);
        }

        // Vérifie si la réponse est OK mais vide
        if(response.status === 204){
            return Promise.resolve();
        } else {
            return response.json();
        }        
    })
    .then(data => {

        // Suppression de l'élément du DOM
        let projectElement = document.querySelector('.modal-project[data-id="' + projectId + '"]');
        if (projectElement) {
            projectElement.remove();
        }

        // Supprime le projet de la liste 'projects'
        projects = projects.filter(project => project.id != projectId);

        projectsCache = null;


        displayProjects(projects);
    })
    .catch(error => console.error('Erreur :', error));
}

document.getElementById('addPhoto').addEventListener('click', function(){
    document.getElementById('myModal').style.display = 'none';
    document.getElementById('addProjectModal').style.display = 'block';
});
document.querySelector('#addProjectModal .close').addEventListener('click', function() {
    document.getElementById('addProjectModal').style.display = 'none';
});
document.getElementById('backToProjects').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('addProjectModal').style.display = 'none';
    document.getElementById('myModal').style.display = 'block';
});

function displayProject(project) {
    const gallery = document.querySelector(".gallery");

    const projectElement = document.createElement("figure");
    projectElement.className = "project"

    projectElement.innerHTML = `
        <img src="${project.imageUrl}" alt="${project.title}">
        <figcaption>${project.title}</figcaption>`;

    gallery.appendChild(projectElement);
}

document.getElementById('projectForm').addEventListener('submit', function(event){
    event.preventDefault();

    const projectImage = document.querySelector("#projectImage").files[0]; // Pour récupérer le fichier image
    const projectTitle = document.querySelector("#projectTitle").value; // Pour récupérer le titre du projet
    const projectCategory = document.querySelector("#projectCategory").value; // Pour récupérer la catégorie du projet

    console.log(projectImage, projectTitle, projectCategory);
    
    if(!projectTitle || !projectCategory || !projectImage){
        alert("Veuillez remplir tous les champs du formulaire");
        return;
    }

    let formData = new FormData();
    formData.append('title', projectTitle);
    formData.append('category', projectCategory);
    formData.append('image', projectImage);

    fetch('http://localhost:5678/api/works', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
    })
    .then(response => response.json())
    .then(project => {
      // Ajoute le nouveau projet à la liste des projets
      projects.push(project);

      displayProject(project);
      document.getElementById('addProjectModal').style.display = 'none';

      // Réinitialise le formulaire
      document.getElementById('projectForm').reset();
      document.getElementById('preview').src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

      const imagePreviewContainer = document.querySelector('#projectImageContainer');
      const imageElement = imagePreviewContainer.querySelector('img');
      const imageInput = imagePreviewContainer.querySelector('input');
    
      for (let i = 0; i < imagePreviewContainer.children.length; i++) {
        imagePreviewContainer.children[i].style.display = 'block';
    }
    imageElement.style.display = 'none';
    imageInput.style.display = 'none';

    })
    .catch(error => console.error('Error:', error));
});

document.addEventListener("DOMContentLoaded", function() {
    const inputs = Array.from(document.querySelectorAll("#projectForm input, #projectForm select"));
    const submitButton = document.querySelector("#submitButton");

    function checkInputs() {
        const allFilled = inputs.every(input => input.value);
        submitButton.disabled = !allFilled;

        if (allFilled) {
            submitButton.classList.add("active");
        } else {
            submitButton.classList.remove("active");
        }
    }

    inputs.forEach(input => input.addEventListener("change", checkInputs));
});

document.getElementById('projectImage').addEventListener('change', function() {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const imagePreviewContainer = document.querySelector('#projectImageContainer');
        const imageElement = imagePreviewContainer.querySelector('img');
        imageElement.src = e.target.result;

        // Cachez tous les éléments enfants de imagePreviewContainer
        for (let i = 0; i < imagePreviewContainer.children.length; i++) {
            imagePreviewContainer.children[i].style.display = 'none';
        }

        // Affichez l'image une fois qu'elle est chargée
        imageElement.style.display = 'block';
    };

    if (file) {
        reader.readAsDataURL(file);
    }
});



