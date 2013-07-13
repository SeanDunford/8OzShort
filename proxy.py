"""Usage: proxy.py <directory> [-p PORT]                                        
                                                                               
Options:                                                                        
 -h --help             Show this help message and exit.                        
 -p PORT --port=PORT   Port to listen [default: 8080]                          
                                                                               
"""                                                                            
                                                                               
from urllib import unquote                                                      
                                                                               
from webob.static import DirectoryApp                                          
from wsgiproxy.app import WSGIProxyApp                                          
                                                                               
                                                                               
class AjaxProxy(object):                                                        
    def __init__(self, directory):                                              
        self.directory = directory                                              
                                                                               
    def __call__(self, environ, start_response):                                
        params = dict(pair.split("=", 1) for pair in                            
            environ.get("QUERY_STRING", "").split("&") if "=" in pair)          
                                                                               
        if "proxy" in params:                                                  
            url = params["proxy"]                                              
            app = WSGIProxyApp(unquote(url))                                    
        else:                                                                  
            app = DirectoryApp(self.directory)                                  
                                                                               
        return app(environ, start_response)                                    
                                                                               
                                                                               
if __name__ == "__main__":                                                      
    from paste.httpserver import serve                                          
    from docopt import docopt                                                  
                                                                               
    arguments = docopt(__doc__)                                                
    app = AjaxProxy(arguments["<directory>"])                                  
    serve(app, port=arguments["--port"])