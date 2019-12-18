# cleaning-robot
Roomba exercise

It's another friday night and you've come home to a dirty living room. Of course it's friday and nobody wants to spend their time cleaning up their house. Fortunately this programme instructs a roomba to tidy up your room whilst you go out and have fun. 

Even better, your room has no furniture -  infact it has nothing, true minimalism.

## Download

click `clone or download` button.

Navigate to an appropriate folder;

    SSH or HTTPS:
    If you have picked this option, simply copy the string given on github.(you can copy to clipboard using the button to the right of the given string)

    then on the cmdline type:

    `$git clone pasted_string`


    ZIP:
    Click on the zipped folder, and then extract to the folder of your choosing

Node.js is required to run the programme. Download and install using the link provided:[Node.js](https://nodejs.org/en/).


## Instructions
With the file on your PC; 

`cd cleaning-robot/`

Once in the file, to run the progamme simply type: `node cleanRoom.js`

Program input will be received in a file with the format described below. The file should be named `input.txt` and reside in the same directory as `cleanRoom.js`.

Example:
```
5 5
1 2
1 0
2 2
2 3
NNESEESWNWW
```
- The first line holds the room dimensions (X Y), separated by a single space (all coordinates will be presented in this format)
- The second line holds the hoover/roomba position
- Subsequent lines contain the zero or more positions of patches of dirt (one per line)
- The last line always contains the driving instructions (at least one)


~~///////////////////////////////////////////~~

If the file is not named `input.txt`, the programme will close.

If `input.txt` contains no data, the programme will close.

If the roomba or dirt is outside the room(i.e the X & Y coordinates are larger than the room's dimensions or they are less than 0), the programme will close.

Finally, if the driving instructions contain other characters other than NWSE the programme will close.
