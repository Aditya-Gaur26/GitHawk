
const github_token ="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";
let current_url = window.location.href;
current_url = current_url.split('/');
let repo_name = current_url[current_url.length-1];
let user_name = current_url[current_url.length-2];

async function get_contributors_list(){
   
    try {
        let {data} = await axios.get(`https://api.github.com/repos/${user_name}/${repo_name}/contributors`,{
            headers: { 'Authorization': `${github_token}` }
        });
        console.log(data);

        let number_of_contributors = data.length;
        let contributors =[];
        for(let i=0;i<number_of_contributors;i++){
            contributors.push({username:data[i].login,contributions:data[i].contributions,avatar:data[i].avatar_url,id:data[i].id})
        }
        $("#number-of-contributors").text(number_of_contributors);
        $(".noc").removeClass("hidden");
        let parent_container = $("#contributors-row");
        parent_container.html("");
        if( number_of_contributors <= 0 ){
            $(".contributors-list-heading").addClass("hidden");
        }
        else{
            $(".contributors-list-heading").removeClass("hidden");   
        }
        contributors.forEach((val,indx,arr)=>{
            let li = $("<div>").addClass("contributor-info col-sm-12 col-md-6 col-lg-4 mb-4").html(
                `<div class="card h-100">
                <div class="avatar" style="background-image:url(${val.avatar})"></div>
                <div class="card-body">
                    <h5 class="card-title">${val.username}</h5>
                    <p class="card-text">Contributions: ${val.contributions}</p>
                    <a href="http://localhost:3000/dashboard/${val.username}" class="btn btn-primary" target="_blank">View Profile</a>
                </div>
            </div>`
            )
            parent_container.append(li);
        })

    } catch (error) {
        console.log(error);
    }
}

async function get_commit_data(){
    try {
        let page=1;
        let data1 = [];
        while(true) {
            let {data} = await axios.get(`https://api.github.com/repos/${user_name}/${repo_name}/commits`,{
                headers: { 'Authorization': `${github_token}` },
                params:{
                    per_page:100,
                    page
                }
            });
            if(data.length == 0) break;
            console.log(data);
            page++;
            data1 = data1.concat(data);
        }

        let data = data1;

        const commits = data.map(commit => commit.commit.author.date.split('T')[0]);

        let commitcounts = {};
        commits.forEach(day => {
            // let day =  new Date(date).toISOString().split('T')[0];
            if(!commitcounts[day]){
                commitcounts[day]=1;
            }
            else commitcounts[day]++;
        });

        let labels = Object.keys(commitcounts);
        let datavals = Object.values(commitcounts);
        const ctx = document.getElementById('commitChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.reverse(),
                datasets: [{
                    label: 'Commits per Day',
                    data: datavals.reverse(),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            displayFormats: {
                                day: 'YYYY-MM-DD'
                            },
                           
                        },
                        title: {
                            display: true,
                            text: 'Days' // Label for X-axis
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Commits' // Label for Y-axis
                        }
                    }
                }
            }
        });
        

    } catch (error) {
        console.log(error);
    }
}


async function get_stargazers_list(){
    try {
        let {data} =  await axios.get(`https://api.github.com/repos/${user_name}/${repo_name}/stargazers`,{
            headers: { 'Authorization': `${github_token}` }
        });
        console.log(data);

        let number_of_stargazers = data.length;
        let stargazers =[];
        for(let i=0;i<number_of_stargazers;i++){
            stargazers.push({username:data[i].login,avatar:data[i].avatar_url,id:data[i].id})
        }
        
        let parent_container = $(".stars-container");
        parent_container.html("");
        if( number_of_stargazers <= 0 ){
            $(".stargazers-heading").addClass("hidden");
        }
        else{
            $(".stargazers-heading").removeClass("hidden");   
        }
        stargazers.forEach((val,indx,arr)=>{
            let li = $("<div>").addClass("stargazer-info col-sm-6 col-md-4 col-lg-3 mb-3").html(
                `<div class="card">
                <div class="avatar" style="background-image:url(${val.avatar})"></div>
                <div class="card-body">
                    <h5 class="card-title">${val.username}</h5>
                    <a href="http://localhost:3000/dashboard/${val.username}" class="btn btn-primary" target="_blank">View Profile</a>
                </div>
            </div>`
            )
            parent_container.append(li);
        })
        
    } catch (error) {
        console.log(error);
    }

}

async function get_watchers_list(){
    try {
        let {data} =  await axios.get(`https://api.github.com/repos/${user_name}/${repo_name}/watchers`,{
            headers: { 'Authorization': `${github_token}` }
        });
        console.log(data);

        let number_of_watchers = data.length;
        let watchers =[];
        for(let i=0;i<number_of_watchers;i++){
            watchers.push({username:data[i].login,avatar:data[i].avatar_url,id:data[i].id})
        }
        
        let parent_container = $(".watchers-container");
        parent_container.html("");
        if( number_of_watchers <= 0 ){
            $(".watchers-heading").addClass("hidden");
        }
        else{
            $(".watchers-heading").removeClass("hidden");   
        }
        watchers.forEach((val,indx,arr)=>{
            let li = $("<div>").addClass("watchers-info col-sm-6 col-md-4 col-lg-3 mb-3").html(
                `<div class="card">
                <div class="avatar" style="background-image:url(${val.avatar})"></div>
                <div class="card-body">
                    <h5 class="card-title">${val.username}</h5>
                    <a href="http://localhost:3000/dashboard/${val.username}" class="btn btn-primary" target="_blank">View Profile</a>
                </div>
            </div>`
            )
            parent_container.append(li);
        })
        
    } catch (error) {
        console.log(error);
    }

}

async function get_subscribers_list(){
    try {
        let {data} =  await axios.get(`https://api.github.com/repos/${user_name}/${repo_name}/subscribers`,{
            headers: { 'Authorization': `${github_token}` }
        });
        console.log(data);

        let number_of_subscribers = data.length;
        let subscribers =[];
        for(let i=0;i<number_of_subscribers;i++){
            subscribers.push({username:data[i].login,avatar:data[i].avatar_url,id:data[i].id})
        }
        
        let parent_container = $(".subscribers-container");
        parent_container.html("");
        if( number_of_subscribers <= 0 ){
            $(".subscribers-heading").addClass("hidden");
        }
        else{
            $(".subscribers-heading").removeClass("hidden");   
        }
        subscribers.forEach((val,indx,arr)=>{
            let li = $("<div>").addClass("subscribers-info col-sm-6 col-md-4 col-lg-3 mb-3").html(
                `<div class="card">
                <div class="avatar" style="background-image:url(${val.avatar})"></div>
                <div class="card-body">
                    <h5 class="card-title">${val.username}</h5>
                    <a href="http://localhost:3000/dashboard/${val.username}" class="btn btn-primary" target="_blank">View Profile</a>
                </div>
            </div>`
            )
            parent_container.append(li);
        })
        
    } catch (error) {
        console.log(error);
    }

}

async function get_open_issues(){
    try {
        let {data} =  await axios.get(`https://api.github.com/repos/${user_name}/${repo_name}/issues`,{
            headers: { 'Authorization': `${github_token}` }
        });
        console.log(data);

        let issues = data.length;

        if(issues<=0){
            $(".issues-heading").addClass("hidden");
        }
        else{
            $(".issues-heading").removeClass("hidden");
        }

        let parent_container = $(".issues-container");
        parent_container.html("");

        for (let i = 0; i < issues; i++) {
            let issue = data[i];
            let li = $("<div>").addClass("issue-info col-sm-12 col-md-6 col-lg-4 mb-4").html(
                `<div class="card h-100">  
                    <div class="card-body d-flex flex-column justify-content-between">
                        <h5 class="card-title">${issue.title}</h5>
                        <p class="card-text">${issue.body}</p>
                        <div class="d-flex flex-column align-items-center mb-3">
                            <a href="http://localhost:3000/dashboard/${issue.user.login}" class="card-link" target="_blank">
                                <div class="avatar" style="background-image:url(${issue.user.avatar_url}); width: 100px; height: 100px; background-size: cover; border-radius: 50%;"></div>
                            </a>
                        </div>
                        <div class="d-flex justify-content-center">
                            <a href="${issue.html_url}" class="btn btn-primary text-center" target="_blank">View Issue</a>
                        </div>
                    </div>
                </div>`
            );
        
            parent_container.append(li);
        }
        


        
    } catch (error) {
        console.log(error);
    }

}

window.onload = ()=>{
    get_contributors_list();
    get_commit_data();
    get_stargazers_list();
    get_watchers_list();
    get_subscribers_list();
    get_open_issues();
}




