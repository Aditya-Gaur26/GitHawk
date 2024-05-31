const input =document.querySelector('.search-text');
const btn  =document.querySelector('.search-btn');

let sort_type = "followers";
let sort_order = "desc";
let input_val_existing="";
btn.addEventListener("click",(event)=>{
    event.preventDefault();
    let inputval = input.value;
    input.value="";
    if(inputval.trim(" ") == ""){
        alert("please type something");
        return;
    }
    input_val_existing = inputval;  
    fetchGitHubUser(inputval);
})

const token = "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";

let container = $('.list-container');
async function fetchGitHubUser(query) {
    try {
       
        const response = await axios.get(`https://api.github.com/search/users`, {
            headers: { 'Authorization': `token ${token}` },
            params: {
                q: query,
                per_page: 10, // Number of results per page
                page: 1,     // Page number
                sort: sort_type, // Sort by number of followers
                order: sort_order 
            }
        });
        user_array = response.data.items;
       
        container.html("");
        let  n  =user_array.length;
        let status =$(".status");
        status.text("");
        if(n!=0){
            status.text(`Top ${n} results based on followers`);
        }
        else{
            status.text(`No users Found`);
        }
        $(".status-and-dropdown").removeClass("hidden");
        if(n ==0){
            $(".sort-options").addClass("hidden");
        }
        else{
            $(".sort-options").removeClass("hidden");
        }
        for(let i=0;i<n;i++){
            let li= $("<a>");
            let username = user_array[i].login;
            let user_data = user_array[i];
           
            li.addClass('list-elements').html(
            `<div class="pfp"></div>
            <div class="user-info">
                <div class="info-items id">
                    <span class="info-id-label info-label">Id</span><span class="info-id-value info-value">${user_data.id}</span>
                </div>
                <div class="info-items name">
                    <span class="info-username-label info-label">username</span><span class="info-username-value info-value">${username}</span>
                </div>
                
            </div>`)
            avatar_url = user_data.avatar_url;
            li[0].querySelector('.pfp').style.backgroundImage = `url('${avatar_url}')`;
            li[0].setAttribute("href",`/dashboard/${username}`)
            container.append(li);

        }
        console.log(response);
    } catch (error) {
       console.log(error);
    }
}


const asc = $(".asc");
const desc = $(".desc");

asc[0].addEventListener("click",()=>{
    if(sort_order != "asc"){
        sort_order = "asc";
        fetchGitHubUser(input_val_existing);
    }
})
desc[0].addEventListener("click",()=>{
    if(sort_order != "desc"){
        sort_order = "desc";
        fetchGitHubUser(input_val_existing);
    }
})

dropdownMenu = document.querySelector(".dropdown-menu");

let date_joined_sort = $(".date-joined-sort");
let repositories_sort = $(".repositories-sort");
let followers_sort = $(".followers-sort");

dropdownMenu.addEventListener("click",(ev)=>{
    let target = ev.target;
    if(target.innerText == "Followers"){
        if(sort_type!="followers"){
            sort_type = "followers";
           
            
            followers_sort.addClass("bg-success");
            date_joined_sort.removeClass("bg-success");
            repositories_sort.removeClass("bg-success"); 
            fetchGitHubUser(input_val_existing);
        }
    }
    else if(target.innerText == "Repositories"){
        if(sort_type!="repositories"){
            sort_type = "repositories";
            
            repositories_sort.addClass("bg-success");
            date_joined_sort.removeClass("bg-success");
            followers_sort.removeClass("bg-success")
            fetchGitHubUser(input_val_existing);
        }
    }
    else if(target.innerText == "Date-Joined"){
        if(sort_type!="joined"){
            sort_type = "joined";
           
            date_joined_sort.addClass("bg-success");
            repositories_sort.removeClass("bg-success");
            followers_sort.removeClass("bg-success")
            fetchGitHubUser(input_val_existing);
        }
    }
})

// container[0].addEventListener('click', (ev)=>{
//     ev.preventDefault();
//     console.log(ev.target);
// })
