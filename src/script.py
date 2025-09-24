import eel
import json
import os

selected_file_location = ""

@eel.expose
def set_selected_file_path(path):
    selected_file_location = path

# TODO: make whole filesystem python based
@eel.expose
def updateJsonFile(rawData):
    if selected_file_location == "":
        return
    file = open(selected_file_location, "w")
    file.write(rawData)
    file.close()

eel.init('web')
eel.start('start.html')