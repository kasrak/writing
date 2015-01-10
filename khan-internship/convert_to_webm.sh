#!/bin/sh

for infile in *.mp4; do
    outfile="${infile%.*}.webm"
    ffmpeg -i $infile -c:v libvpx -crf 10 -b:v 1M -c:a libvorbis $outfile
done
