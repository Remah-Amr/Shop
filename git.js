****************************************************

CREATE FILES USING TERMINAL
// if you want to create any files in your folder by terminal write : touch name.html or name.js

*****************************************************

DIFFERENCE BETWEEN BRANCHES AND COMMITS
// branches represent the version of myCode so , i can work in branch while my friend add login system in another branch'version' , third person add validation then at end we merge branches we need together
// so branch contain with multiple commits , we can only push the head commit 'latest one' 
// when you create a new branch you copy of master branch then you add on it 'not project from scratch'

*****************************************************

BRANCHES
// to show all branchs : git branch -a
// to delete branch : git branch -D 'nameOfBranch'
// to create branch then checkout it in one step : git checkout -b 'nameOfNewBranch'
// when you want to add something without loss original folder or instead of to copy the folder:
// you can remote to another branch then write what you want by:
// git branch 'name'
// git checkout 'name'
// do every thing or change you want
// git add .
// git commit -m 'name' **** 'commit mean save points'
// then : git checkout master 'ORIGINAL BRACH'
// git merge name 'NAME OF NEW BRANCH'

********************************************************
NOTES ABOUT MERGING 
// if you e.g. multer in your master branch then in your new branch 'filePond" you delete it and add filePond then switch to master and merge with test , git make editor adapter with filePond branch and master branch will delete multer and add filePond
********************************************************

CONFLICT WHEN MERGING
// if get error go to lines which editor added then delete it then write : git add . , git commit 'without commitName'

****************************************************

STATUS
// you can write git status to know which branch you in

****************************************************************

SAVE CHANGES AND DELETE
// don't forget after any change to 'add .' then 'commit' ,,,,, 
// untracked file mean that not added to repo so i add it then i save by commit 
// if you mistake then add node_modules and not ignore it run : git rm --cached node-modules 

***************************************************************

MOVE ON COMMITS :
// when you want to add something without loss original folder or instead of to copy the folder:
// commit current status of your code then add your changes then commit it and when you to go to previous commit or any commit write git log --oneline then choose commit then write git checkout 'id'
// then last commit call Head of 'branch name' so when you want to go to last commit in branch write : git checkout master or 'nameOfBranch'

// if you have four commits : express ,bodyParser ,validation ,authentication => then you want to see project without validation section (and with all others include authentication) then you write:
// git revert 'id' then ctrl X then no save 

// to delete in above last to commits we write : git reset id 'ofBodyParser commit' --hard 

IMPORTANT NOTE: TO PUSH ANYTHING YOU HAVE TO BE IN HEAD OF BRANCH 'LAST COMMIT' 

************************************************************
GITHUB
// https://help.github.com/en/enterprise/2.14/user/articles/pushing-commits-to-a-remote-repository
// if you want to add to github write: 
//  you can in one step : git push 'link above when create repo' master(nameOfBranch)
-- CHANGING YOU WANT TO PUSH IN REMOTE REPO TO SAME BRANCH => git push 'link above when create repo' master(nameOfBranch) 
-- INSTEAD OF WRITE ALL LINK EACH TIME YOU CAN ADD ALIAS (IF YOU USE SECOND METHOD) => git remote add origin(or any name) 'link' 
-- then write:  git push  origin master (these names may change , master here which in github)
-- alias name will add to repo to all branches
-- write : git remote to see your remotes 
**************************************
RENAME BRANCHES IN PUSH
//To rename a branch, you'd use the same git push command, but you would add one more argument: the name of the new branch. For example:

//git push  <REMOTENAME> <LOCALBRANCHNAME>:<REMOTEBRANCHNAME> 

//This pushes the LOCALBRANCHNAME to your REMOTENAME, but it is renamed to REMOTEBRANCHNAME.
***************************************
CLONE
// if you want to download any project in github 
// open your current folder in terminal 
// like cd Desktop then cd name
// then write: git clone https://github.com/Remah-Amr/chat.git 'link of project'
// when you clone , git will initialize remote 'origin' to link what you clone to it , then you don't have to add remote

**************************************************
PULL 
// if you want to download any changes in your code in github on your own branch write: git pull or git pull <remote> <branch>

************************************
COLLABRATING
// when me add branch in the repo on github then gomaa add another branch by adding remote 'link of repo and submit by user and password' then made request pull to others members team to merge this branch with master one.
https://www.youtube.com/watch?v=MnUd31TvBoU
****************************
FORKING
//if you find project 'to another owner' then you have to edit in it you will fork it , clone , edit , push , and make pull request to owner to merge it
//https://www.youtube.com/watch?v=HbSjyU2vf6Y
****************************************
ADDING with brad
// git remote add origin https://github.com/Remah-Amr/chat.git
//git push -u origin nameOfBranch 

