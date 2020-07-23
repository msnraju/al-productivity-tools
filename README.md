# Microsoft Dynamics 365 Business Central - AL Productivity Tools
![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/msnraju.al-productivity-tools)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/msnraju.al-productivity-tools)
![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/msnraju.al-productivity-tools)
![Visual Studio Marketplace Rating (Stars)](https://img.shields.io/visual-studio-marketplace/stars/msnraju.al-productivity-tools)

This extension is intended to provide developer tools to increase your productivity in developing Microsoft Dynamics 365 Business Central extensions.
Commands in the current release are mainly focused on AL Coding Guidelines, and File naming notation.
Currently available commands are focused on fixing some of the common warnings, and errors raised by [CodeCop](https://docs.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/analyzers/codecop) analyzer.


## Commands and Usage

### Fix AL CodeCop Issues
Run the 'Fix AL CodeCop Issues' command from the Command Palette (`Ctrl+Shift+P`).

This command will do the following
* [File structure](https://docs.microsoft.com/en-us/dynamics365/business-central/dev-itpro/compliance/apptest-bestpracticesforalcode#file-structure) - AL Code  will be arranged in the following order
    1. Properties
    2. Object-specific constructs such as
        * Table fields
        * Page layout
        * Actions
    3. Global variables
        * Labels
        * Global variables
    4. Methods
        * Global
        * Local
* Variable declarations ([Rule AA0021](https://docs.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/analyzers/codecop-aa0021-variabledeclarationsshouldbeorderedbytype)) - Variable declarations will be ordered by type. 

* [Line length](https://docs.microsoft.com/en-us/dynamics365/business-central/dev-itpro/compliance/apptest-bestpracticesforalcode#line-length) - If the length of the method declaration is too big, it will convert the declaration into multiple lines. 

* [Type definition (colon)](https://docs.microsoft.com/en-us/dynamics365/business-central/dev-itpro/compliance/apptest-bestpracticesforalcode#type-definition-colon) - Variable, and parameter declarations are auto corrected.

* The EventSubscriber method must be local ([Rule AA0207](https://docs.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/analyzers/codecop-aa0207-eventsubscriberfunctionsmustbelocal)) - Converts EventSubscribers method to local.

* Keywords Case Conversion - All keywords are converted to keywords in AL programming.

### Fix AL CodeCop Issues In All Files
Run the 'Fix AL CodeCop Issues In All Files' command from the Command Palette (`Ctrl+Shift+P`). 
This will run 'Fix AL CodeCop Issues' command on all the files in the current workspace.

### Fix AL File Naming Notation
Run the 'Fix AL File Naming Notation' command from the Command Palette (`Ctrl+Shift+P`). This command will fix the [file naming notation](https://docs.microsoft.com/en-us/dynamics365/business-central/dev-itpro/compliance/apptest-bestpracticesforalcode#file-naming-notation) as per the best practices for AL.

## Report an Issue

You can report issue on [Github](https://github.com/msnraju/al-productivity-tools/issues)




