const membersList = document.getElementById('members');
const memberInfo = document.getElementById('member-info');
const activitiesList = document.getElementById('activities-list');
const adminSection = document.getElementById('admin-section');
document.getElementById('group-name').textContent = 'I WONDER';

const authorizedRoles = ['chairperson', 'assistant chairperson', 'treasurer', 'secretary'];

function promptUserRole() {
    currentUserRole = prompt('Enter your role (chairperson, assistant chairperson, treasurer, secretary):');
    if (authorizedRoles.includes(currentUserRole)) {
        adminSection.style.display = 'block';
    } else {
        adminSection.style.display = 'none';
        alert('You do not have admin permissions. You can only view information.');
    }
}


function fetchMembers() {
    fetch('http://localhost:3000/members')
        .then(response => response.json())
        .then(members => displayMembers(members))
}

function displayMembers(members) {
    membersList.innerHTML = '';
    members.forEach(member => {
        const li = document.createElement('li');
        li.textContent = member.name;
        li.addEventListener('click', () => displayMemberDetails(member));
        membersList.appendChild(li);
    });
}

function displayMemberDetails(member) {
    memberInfo.innerHTML = `
        <p><strong>Name:</strong> ${member.name}</p>
        <p><strong>Position:</strong> ${member.position}</p>
        <p><strong>Contribution:</strong> ${member.contribution}</p>
        <p><strong>Balance:</strong> ${member.balance}</p>
    `;

   
    if (authorizedRoles.includes(currentUserRole)) {
        const updateContributionButton = document.createElement('button');
        updateContributionButton.textContent = 'Update Contribution and Balance';
        updateContributionButton.onclick = function() {
            updateContributionAndBalance(member);
        };
        memberInfo.appendChild(updateContributionButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Member';
        deleteButton.onclick = () => deleteMember(member.id);
        memberInfo.appendChild(deleteButton);
    }
}


function updateContributionAndBalance(member) {
    const newContribution = prompt(`Enter the new contribution amount for ${member.name}:`, member.contribution);
    const newBalance = prompt(`Enter the new balance for ${member.name}:`, member.balance);

    if (newContribution !== null && newBalance !== null) {
        fetch(`http://localhost:3000/members/${member.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contribution: newContribution, balance: newBalance })
        })
        .then(response => response.json())
        .then(updatedMember => {
            displayMemberDetails(updatedMember);
            alert(`${member.name}'s contribution and balance have been updated successfully.`);
        })
      }
}

function deleteMember(memberId) {
    if (confirm('Are you sure you want to delete this member?')) {
        fetch(`http://localhost:3000/members/${memberId}`, {
            method: 'DELETE',
        })
        .then(() => {
            alert('Member deleted successfully.');
            fetchMembers();
        })
    }
}


document.getElementById('add-member-btn').addEventListener('click', () => {
    if (!authorizedRoles.includes(currentUserRole)) {
        alert('You do not have permission to add members.');
        return;
    }

    const name = prompt('Enter the name of the new member:');
    const position = prompt('Enter the position of the new member:');
    const contribution = prompt('Enter the contribution of the new member:');
    const balance = prompt('Enter the balance of the new member:');
  

    if (name && position && contribution && balance) {
        const newMember = { name, position, contribution, balance };

        fetch('http://localhost:3000/members', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMember)
        })
        .then(response => response.json())
        .then(member => {
            alert('New member added successfully.');
            fetchMembers(); 
        })
    }
});

document.getElementById('add-activity-btn').addEventListener('click', () => {
    if (!authorizedRoles.includes(currentUserRole)) {
        alert('You do not have permission to add activities.');
        return;
    }

    const newActivity = prompt('Enter the activity details:');
    if (newActivity) {
        fetch('http://localhost:3001/activities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ activity: newActivity })
        })
        .then(response => response.json())
        .then(activity => {
            alert('Activity added successfully.');
            fetchActivities(); 
    })
}});


function updateActivity(activityId) {
    const newActivityDetails = prompt('Enter the new activity details:');
    if (newActivityDetails) {
        fetch(`http://localhost:3001/activities/${activityId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ activity: newActivityDetails })
        })
        .then(response => response.json())
        .then(updatedActivity => {
            alert('Activity updated successfully.');
            fetchActivities();
        })
    }
}


function fetchActivities() {
    fetch('http://localhost:3001/activities')
        .then(response => response.json())
        .then(activities => {
            activitiesList.innerHTML = '';
            activities.forEach(activity => {
                const li = document.createElement('li');
                li.textContent = activity.activity;

                
                if (authorizedRoles.includes(currentUserRole)) {
                    const updateButton = document.createElement('button');
                    updateButton.textContent = 'Update';
                    updateButton.onclick = () => updateActivity(activity.id);
                    li.appendChild(updateButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.onclick = () => deleteActivity(activity.id);
                    li.appendChild(deleteButton);
                }

                activitiesList.appendChild(li);
            });
        })
}

function deleteActivity(activityId) {
    if (confirm('Are you sure you want to delete this activity?')) {
        fetch(`http://localhost:3001/activities/${activityId}`, {
            method: 'DELETE',
        })
        .then(() => {
            alert('Activity deleted successfully.');
            fetchActivities()
        })
    }
}

promptUserRole()
fetchMembers()
fetchActivities()
