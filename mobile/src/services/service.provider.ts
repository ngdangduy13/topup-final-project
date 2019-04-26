import NavigatorService from "./navigator.service";
import { ServiceProxy } from "./service-proxies";

const navigatorService = new NavigatorService();
const apiService = new ServiceProxy("http://localhost:3003/api");

const serviceProvider = {
  NavigatorService: (): NavigatorService => {
    return navigatorService;
  },
  ApiService: (): ServiceProxy => {
    return apiService;
  }
};

export default serviceProvider;
