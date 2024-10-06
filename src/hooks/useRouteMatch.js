import {useLocation, mathPath} from "react-router-dom";

export default function useRouteMatch(path){
    const location = useLocation();
    return mathPath(path, location) === path;  // Returns true if the current path matches the given path. Otherwise, returns false.
 
}