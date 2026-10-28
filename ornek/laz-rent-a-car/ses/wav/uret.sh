cd /c/Users/PC/Desktop/ajans-sitesi/ornek/laz-rent-a-car/ses
PY=/c/AI/venv-ses/Scripts/python.exe; U=/c/Users/PC/Desktop/ajans-sitesi/tanitim/ses/ayse-anapc/ayse_uret.py
$PY -I $U wav/sesli-mesaj.wav wav/sesli-mesaj.txt 3 && echo "OK sesli-mesaj"
for k in $(PYTHONIOENCODING=utf-8 python -c "import json;print(' '.join(json.load(open('../rehber.json',encoding='utf-8'))))"); do
  PYTHONIOENCODING=utf-8 python -c "import json,sys;open('wav/'+sys.argv[1]+'.txt','w',encoding='utf-8').write(json.load(open('../rehber.json',encoding='utf-8'))[sys.argv[1]]['metin'])" $k
  $PY -I $U wav/$k.wav wav/$k.txt 3 && ffmpeg -y -loglevel error -i wav/$k.wav -ac 1 -b:a 96k $k.mp3 && echo "OK $k"
done
