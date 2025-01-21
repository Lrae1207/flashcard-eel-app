import eel
import json
import os

cur_dir = os.getcwd()

# returns parsed json object
@eel.expose
def read_file(filename):
    with open("web/sets/" + filename, 'r+') as file:
        data = json.load(file)
        print(data)
        return data
    return None

# return all file names in web/sets
@eel.expose
def get_file_names():
    os.chdir(cur_dir + "/web/sets")
    names = os.listdir()
    return names

eel.init('web')
eel.start('start.html')