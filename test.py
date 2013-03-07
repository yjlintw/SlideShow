import os
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

yearDivString = '<div id="$year" class="Award">\n$contentYear</div>\n'
awardDivString = '\t<div class="$award">\n\t\t$contentAward\n\t</div>\n'

rootPath = './resources/'
yearPath = ''
awardTypePath = ''
prizePath = ''
fileName = ''
outputString = ''

def listFiles(path):
	myFiles = os.listdir(path)
	output = ''
	for myFile in myFiles:
		myFilePath = os.path.join(os.path.abspath(path), myFile)
		if os.path.isdir(myFilePath):
			output += listFiles(myFilePath)
		else :
			#print os.path.relpath(myFilePath, os.path.abspath(os.curdir))
			output += '\t\t../' + os.path.relpath(myFilePath, os.path.abspath(os.curdir))+ ',\n'
	#print output
	return output

yearFolders = os.listdir(rootPath)
for yearFolder in yearFolders:
	# year
	yearPath = os.path.join(rootPath,yearFolder)
	tmpYearString = ''
	if os.path.isdir(yearPath):
		tmpYearString = yearDivString
		tmpYearString = tmpYearString.replace("$year", yearFolder)
		
		#award
		awardTypeFolders = os.listdir(yearPath)
		awardsString = ''
		for awardTypeFolder in awardTypeFolders:
			awardTypePath = os.path.join(yearPath,awardTypeFolder)
			tmpAwardString = ''
			if os.path.isdir(awardTypePath):
				tmpAwardString = awardDivString
				tmpAwardString = tmpAwardString.replace("$award", awardTypeFolder[3:])
				##prize
				tmpString = listFiles(awardTypePath).strip(' \t\n\r,')
				tmpString = tmpString.replace('\\', '/')
				tmpAwardString = tmpAwardString.replace("$contentAward", tmpString)



			awardsString += tmpAwardString

		tmpYearString = tmpYearString.replace("$contentYear", awardsString)
		

	outputString += tmpYearString;


file = open('./html/embeded.html', 'w+')
file.write(outputString.decode("big5").encode("utf-8"))


