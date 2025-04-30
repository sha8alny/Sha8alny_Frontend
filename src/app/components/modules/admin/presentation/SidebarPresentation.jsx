"use client";  

import Link from "next/link"; 
import MenuIcon from "@mui/icons-material/Menu"; 
import CloseIcon from "@mui/icons-material/Close"; 
import LogoutIcon from "@mui/icons-material/Logout";  

/**  
 * @namespace admin  
 * @module admin  
 */ 
/**  
 * SidebarPresentation component renders a sidebar with navigation links and admin actions.  
 * It includes a toggle button to open/close the sidebar on smaller screens.  
 *  
 * @param {Object} props - The component props.  
 * @param {string} props.pathname - The current pathname to determine the active route.  
 * @param {boolean} props.isOpen - A boolean indicating whether the sidebar is open or closed.  
 * @param {Function} props.setIsOpen - A function to toggle the sidebar open/closed state.  
 * @param {Array} props.routes - An array of route objects for navigation links.  
 * @param {string} props.routes[].path - The path of the route.  
 * @param {string} props.routes[].name - The name of the route.  
 * @param {React.Component} props.routes[].icon - The icon component for the route.  
 * @param {Object} props.adminAction - Admin action with name, icon, and onClick function.
 */  

export function SidebarPresentation({ pathname, isOpen, setIsOpen, routes, adminAction }) {   
  return (     
    <>       
      <button         
        className="fixed bottom-4 right-6 z-50 lg:hidden p-2 border-2 rounded-full transition-all bg-transparent border-secondary text-secondary hover:bg-secondary hover:text-background cursor-pointer"         
        onClick={() => setIsOpen(!isOpen)}         
        data-testid="toggle-sidebar"       
      >         
        {isOpen ? (           
          <CloseIcon fontSize="small" />         
        ) : (           
          <MenuIcon fontSize="small" />         
        )}       
      </button>        
      
      <div         
        className={`h-auto fixed inset-y-0 left-0 z-40 w-64 bg-foreground text-text shadow-lg transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}       
      >         
        <div className="flex flex-col sticky top-16">           
          <div className="p-4 border-b flex gap-2 items-center justify-center">             
            <h2 className="text-xl font-bold flex-grow">               
              {" "}               
              SHA<p className="text-secondary inline">غ</p>LNY{" "}               
              <p className="text-secondary inline">ADMIN</p>             
            </h2>           
          </div>           
          
          <nav className="flex-1 p-4 space-y-1">             
            {routes.map((route) => (               
              <Link                 
                key={route.path}                 
                href={route.path}                 
                data-testid={route.name}                 
                onClick={() => setIsOpen(false)}                 
                className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors cursor-pointer ${
                  pathname === route.path
                    ? "bg-secondary text-background"
                    : "hover:bg-secondary hover:text-background"
                }`}               
              >                 
                <route.icon className="mr-3" fontSize="small" />                 
                {route.name}               
              </Link>             
            ))}           
          </nav>
          
          {adminAction && (
            <div className="p-4 border-t">
              <button
                onClick={adminAction.onClick}
                className="flex items-center w-full px-4 py-3 text-sm rounded-md transition-colors cursor-pointer hover:bg-secondary hover:text-background"
                data-testid={adminAction.name}
              >
                <adminAction.icon className="mr-3" fontSize="small" />
                {adminAction.name}
              </button>
            </div>
          )}
        </div>       
      </div>     
    </>   
  ); 
}