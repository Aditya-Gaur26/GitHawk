
let sort_type = "full_name";
let sort_order = "asc";
let page_number =1;
let username;
let repo_count;
let number_of_pages;
let repos=[];

let current_repos;
let current_page;
let total_pages;
let repos_sorted_stars = [];
let repos_sorted_forks =[];
let repos_sorted_name =[];
let repos_sorted_open_issues =[];
let repos_sorted_size = [];

const repositoriesContainer = $(".repositories-items");
const github_token = "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";


window.onload = async ()=>{
    username = document.querySelector("#username").innerText;
    repo_count = document.querySelector("#repo-count").innerText;

    populate_repo_container_intially();
    fetch_all_repos();
}


function handlePagebuttons(){
    $(".page-numbers").html(`<button class="pn previous-page-btn btn btn-warning">Previous</button>
                             <button class="pn next-page-btn btn btn-warning">Next</button>
    `);

    if(current_page == 1){
        $(".previous-page-btn").addClass("disabled-btn");
    }
    if(current_page == total_pages){
        $(".next-page-btn").addClass("disabled-btn");
    }
    let previousbtn  = $(".previous-page-btn");
    let nextbtn = $(".next-page-btn");
   
    for(let i=current_page;i<=total_pages && i<=current_page+4;i++){
        let li = $("<a>").addClass("pn").addClass("page-number-item").text(i);
        nextbtn.before(li);
        if(i==current_page){
            li.addClass("current-page");
        }
    }
    
    
}


async function populate_repo_container_intially(){
    const config = {
        headers: {
            Authorization: `token ${github_token}` 
        },
        params: {
            per_page:5 , 
            page: 1, 
            sort: "created", 
            direction: "asc", 
        }
    };
    
    
    let {data} = await axios.get(`https://api.github.com/users/${username}/repos`, config)
    console.log(data);
    repositoriesContainer.html("");
    
    for(let i=0;i<data.length;i++){

        let irepo  =data[i];
        let current_url = window.location.href;
        let li = $("<button>").addClass("repo-card")
                    .html(`<h3 class="repo-card-items repo-name">${irepo.name}</h3>
                            <p class="repo-card-items repo-language">Languages: ${irepo.language}</p>
                            <p class="repo-card-items repo-stats">Stars: ${irepo.stargazers_count} | Forks: ${irepo.forks_count} | Open Issues: ${irepo.open_issues_count}</p>
                            <div class="repo-card-items repo-link" ><a  href="${current_url + '/' +irepo.name}" >View Repository</a>
                            </div>`   
            );

        console.log(li[0]);
        repositoriesContainer.append(li);
        
    }
    current_repos = data;
    
    total_pages = Math.ceil(repo_count / 5);
    current_page=1;
    handlePagebuttons();
    console.log(data);    
}


async function fetch_all_repos(){
    let repos_fetched = 0;
    let pn = 1;
    while(repos_fetched < repo_count){
        const config = {
            headers: {
                Authorization: `token ${github_token}` 
            },
            params: {
                per_page:100 , // Return 10 items per page
                page: pn, // Fetch the first page of results
                sort:"created",
                direction:"asc"
            }
        };
        let {data} = await axios.get(`https://api.github.com/users/${username}/repos`, config)
        repos_fetched += data.length;
        pn++;
        repos = repos.concat(data);
        current_repos =repos;
      
        // console.log(repos);
        // console.log(data);
    }
}

function populate_repo_container(arr,page=1){
    let irepo = arr;
    page--;
    let current_url = window.location.href;
    if(sort_order == "asc"){
        repositoriesContainer.html("");
        
        for(let i=0+page*5;i<5+page*5 && i<arr.length;i++){
    
            let irepo  =arr[i];
            let li = $("<button >").addClass("repo-card")
                        .html(`<h3 class="repo-card-items repo-name">${irepo.name}</h3>
                                <p class="repo-card-items repo-language">Languages: ${irepo.language}</p>
                                <p class="repo-card-items repo-stats">Stars: ${irepo.stargazers_count} | Forks: ${irepo.forks_count} | Open Issues: ${irepo.open_issues_count}</p>
                                <div class="repo-card-items repo-link" ><a  href="${current_url + '/' +irepo.name}" >View Repository</a>
                                </div>`   
                );
    
            // console.log(li[0]);
            repositoriesContainer.append(li);
        }
    }
    else{
        repositoriesContainer.html("");
        
        for(let i=arr.length - page*5 - 1;i >=0 && i>=arr.length -5 - page*5;i--){
    
            let irepo  =arr[i];
            let li = $("<button >").addClass("repo-card")
                        .html(`<h3 class="repo-card-items repo-name">${irepo.name}</h3>
                                <p class="repo-card-items repo-language">Languages: ${irepo.language}</p>
                                <p class="repo-card-items repo-stats">Stars: ${irepo.stargazers_count} | Forks: ${irepo.forks_count} | Open Issues: ${irepo.open_issues_count}</p>
                                <div class="repo-card-items repo-link" ><a  href="${current_url + '/' +irepo.name}" >View Repository</a>
                                </div>`   
                );
            console.log(li[0]);
            repositoriesContainer.append(li);
        }
    }
    page++;
    current_page=page;
    handlePagebuttons();
    current_repos  =arr;


}

const asc = $(".asc");
const desc = $(".desc");

asc[0].addEventListener("click",()=>{
    if(sort_order != "asc"){
        sort_order = "asc";
        populate_repo_container(current_repos);
    }
})
desc[0].addEventListener("click",()=>{
    if(sort_order != "dsc"){
        sort_order = "dsc";
        populate_repo_container(current_repos);
    }
})

dropdownMenu = document.querySelector(".dropdown-menu");

let name_sort = $(".name-sort");
let stars_sort = $(".stars-sort");
let forks_sort = $(".forks-sort");
let size_sort = $(".size-sort");
let date_created_sort = $(".date-created-sort");
let open_issues_sort = $(".open-issues-sort")

dropdownMenu.addEventListener("click",(ev)=>{
    let target = ev.target;
    if(target.innerText == "Name"){
        if(sort_type!="full_name"){
            sort_type = "full_name";
            
            dropdownMenu.childNodes.forEach(child =>{
                if (child.nodeType === Node.ELEMENT_NODE) {
                    // Remove the class from the child element
                    child.classList.remove('selected');
                }
            })
            name_sort.addClass("selected");
            if(repos_sorted_name.length == 0){
                repos_sorted_name = repos.slice().sort((a,b)=> a.localeCompare(b));
            }
            
            populate_repo_container(repos_sorted_name);
        }
    }
    else if(target.innerText == "Stars"){
        if(sort_type!="stars"){
            sort_type = "stars";
            
            dropdownMenu.childNodes.forEach(child =>{
                if (child.nodeType === Node.ELEMENT_NODE) {
                    // Remove the class from the child element
                    child.classList.remove('selected');
                }
            })
            stars_sort.addClass("selected");
            if(repos_sorted_stars.length == 0){
                repos_sorted_stars = repos.slice().sort((a,b)=> a.stargazers_count - b.stargazers_count);
            }
            populate_repo_container(repos_sorted_stars);
        }
    }
    else if(target.innerText == "Forks"){
        if(sort_type!="forks"){
            sort_type = "forks";
            
            dropdownMenu.childNodes.forEach(child =>{
                if (child.nodeType === Node.ELEMENT_NODE) {
                    // Remove the class from the child element
                    child.classList.remove('selected');
                }
            })
            forks_sort.addClass("selected"); 
            if(repos_sorted_forks.length == 0){
                repos_sorted_forks = repos.slice().sort((a,b)=> a.forks_count - b.forks_count);
            }
            populate_repo_container(repos_sorted_forks);
        }
    }else if(target.innerText == "Open Issues"){
        if(sort_type!="open-issues"){
            sort_type = "open-issues";
            
            dropdownMenu.childNodes.forEach(child =>{
                if (child.nodeType === Node.ELEMENT_NODE) {
                    // Remove the class from the child element
                    child.classList.remove('selected');
                }
            })
            open_issues_sort.addClass("selected"); 
            if(repos_sorted_open_issues.length == 0){
                repos_sorted_open_issues = repos.slice().sort((a,b)=> a.open_issues_count - b.open_issues_count);
            }
            populate_repo_container(repos_sorted_open_issues);
        }
    } else if(target.innerText == "Date Created"){
        if(sort_type!="created"){
            sort_type = "created";
            
            dropdownMenu.childNodes.forEach(child =>{
                if (child.nodeType === Node.ELEMENT_NODE) {
                    // Remove the class from the child element
                    child.classList.remove('selected');
                }
            })
            date_created_sort.addClass("selected"); 
            populate_repo_container(repos);
        }
    } else if(target.innerText == "Size"){
        if(sort_type!="size"){
            sort_type = "size";
            
            dropdownMenu.childNodes.forEach(child =>{
                if (child.nodeType === Node.ELEMENT_NODE) {
                    // Remove the class from the child element
                    child.classList.remove('selected');
                }
            })
            size_sort.addClass("selected"); 
            if(repos_sorted_size.length == 0){
                repos_sorted_size = repos.slice().sort((a,b)=> a.size - b.size);
            }
            populate_repo_container(repos_sorted_size);
        }
    }
})

document.querySelector(".page-numbers").addEventListener("click",(ev)=>{
    let target =ev.target;
    console.log(target.tagName);
    if(target.tagName == "A"){
        let page = target.innerText;
        page = +page;
        populate_repo_container(current_repos,page);
    }
    else if(target.tagName == "BUTTON"){
        if(target.innerText == "Previous"){
            current_page--;
            populate_repo_container(current_repos,current_page);
        }
        else if(target.innerText == "Next"){
            current_page++;
            populate_repo_container(current_repos,current_page);
        }
    }
})