# Story Mirror Assignment
An assignment done for StoryMirror as a part of interview process.

**Author: Nikhil Gurnani (gurnanikhil@gmail.com)**

## Automated setup
1. Open Terminal / CLI and run `git clone https://github.com/nikhilgurnani/storymirrorassignment`. After cloning, run `cd storymirrorassignment` 
2. To be on the safer side, run `chmod u+x setup-app.sh`. You might have to use `sudo chmod u+x setup-app.sh` if the previous command gives a permission denied error.
3. Run MongoDB Server by opening a new terminal window and entering `mongod`.
4. Run `setup-app.sh` or `./setup-app` command to execute shell script.
5. If all goes well, run `npm run start`.

## Manual setup
1. Open Terminal / CLI and run `gir clone https://github.com/nikhilgurnani/storymirrorassignment` . After cloning, run `cd storymirrorassignment` 
2. Run `npm install`
3. Run MongoDB Server by opening a new terminal window and entering `mongod`.
4. Make a new file in the root of the folder and copy contents of `.env.example` to the new file, change the value of the variables and save the new file as `.env`.
5. If all goes well, run `npm run start`.


Postman Collection: `https://www.getpostman.com/collections/d19dacf94968d53cf025`
