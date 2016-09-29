If you'd like to compile the dictionary from scratch, that could take several
weeks -- if you include harvesting data from google translate. 
But I've included the harvested data, so it should be easier.

cd source/
```bash
./genAll.sh # will generate it all
```

note that it is unfortunately single-thread javascript, that it why it takes so
long. if it was necessary to do it very often, would have rewritten it in
openCL.

