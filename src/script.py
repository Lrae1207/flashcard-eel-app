import eel
import json
import os

cur_dir = os.getcwd()
file_location = cur_dir

# TODO: make whole filesystem python based
@eel.expose
def updateJsonFile(rawData):
    file = open("file_location", "w")
    file.write(rawData)
    file.close()

eel.init('web')
eel.start('start.html')