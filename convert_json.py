import re
with open("ITP.json") as f_in:
    for line in f_in:
        line = line.strip()
	if "video" in line:
            line = re.sub('videos": ', 'videos": [', line)
	    line = re.sub('$', ']', line)
        print(line)
