import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { filter, map, Observable } from 'rxjs';
import OktaAuth, { AuthState } from '@okta/okta-auth-js';
import { ApiService } from '../apiService/api-service';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';


export interface KpiData {
  value: number;
  dataType: string;
  unit: string;
}

export interface PeriodicElement {
  kpiData: KpiData;
  teamName: string;
}


@Component({
  selector: 'app-profile',
  templateUrl:'./profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  form: FormGroup;
  public name$!: Observable<string>;
  userid:string = ''
  displayedColumns: string[] = ['value', 'dataType', 'unit', 'teamName'];
  dataSource: KpiData[] = [];
  userdata : any = ""
  loading = false;
  selectedModule: ModuleDetail | null = null;
  selectedDate: Date | null = null;
  selectedKpiDataType: string | undefined;
  
  onClick(): void {
    // Set loading to true to show the spinner
    this.loading = true;
    this.dataSource = [];

    // Reset other variables as needed
    this.selectedDate = null;
    this.selectedModule = null;
    this.selectedKpiDataType = undefined;
    // Simulate an asynchronous operation (e.g., an HTTP request)
    setTimeout(() => {
      // After the operation is complete, set loading back to false
      this.loading = false;
    }, 2000); // Adjust the time as needed
  }

  constructor(private fb: FormBuilder,private _router: Router,private _route: ActivatedRoute,private _oktaAuthStateService: OktaAuthStateService,private apiService: ApiService, @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth, private datePipe: DatePipe) { 
    this.form = this.fb.group({
      selectedDate: [null, Validators.required],
      selectedModule: [null, Validators.required],
      selectedKpiDataType: [null, Validators.required],
    });
  }

  public ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.userid  = params['data'];
      // Use the data
    });
    this.userdata = this.getUserData(this.userid)
    
    this.name$ = this._oktaAuthStateService.authState$.pipe(
      filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
      map((authState: AuthState) => {
        const name = authState.idToken?.claims.name ?? '';
        console.log('ID Token Claims:', authState.idToken?.claims);
        this.userid = authState.idToken?.claims.preferred_username ?? '';
        return name;
      })
    );
    

  }

  user: User | undefined;
  modules: Module[] | undefined;
  modulesList: ModuleDetail[]| undefined;
  kpiDataTypes: string[] = [];
  
  userMouleData: any[] = [];
  getUserData(userId:string) {
    
    // Now you can use this.searchTerm for your search logic
    console.log("User Id is "+this.userid)
    this.apiService.getUserData(userId ).subscribe((response: any) => {
      this.userMouleData = response;
      console.log(this.userMouleData)
      this.user = response.user;
        this.modules = response.module;
        
        if (this.modules?.[0]?.modules) {
          // Safe to access this.modules[0].modules here
          this.modulesList = this.modules[0].modules;
          // Now you can work with modulesArray
        } else {
          // Handle the case where either this.modules, this.modules[0], or this.modules[0].modules is undefined
        }
    },(error: any) => {
      console.log(error)
      
    });
  }
  fetchKpiDataTypes() {
    const moduleId = (this.selectedModule?.moduleId || '').toString();
    console.log(moduleId)
    this.apiService.getKpiTypeData(moduleId).subscribe((response: any) => {
      this.kpiDataTypes = response
      console.log(this.kpiDataTypes)
       
    },(error: any) => {
      console.log(error)
      
    });

  }
  getKpiData() {
    const moduleId = (this.selectedModule?._id || '').toString();
    const kpiType = (this.selectedKpiDataType|| '').toString();
    const selectedFormatedDate = this.formatDate();
    const userId = this.user?._id || '';
    // Set loading to true to show the spinner
    this.loading = true;
  
    
    this.apiService.getKpiReportData(userId,selectedFormatedDate,"none",kpiType, moduleId).subscribe((response: PeriodicElement[]) => {
     

      this.dataSource = response.map((item: PeriodicElement) => ({
        value: item.kpiData.value,
        dataType: item.kpiData.dataType,
        unit: item.kpiData.unit,
        teamName: item.teamName
      }));

      console.log(this.kpiDataTypes)
      this.loading = false;
       
    },(error: any) => {
      console.log(error)
      this.loading = false;
      
    });

  }

  formatDate(): string {
    // Use the DatePipe to format the date
    
    return this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd') ?? '';
  }
  onModuleSelectionChange() {
    this.fetchKpiDataTypes();

    // Optionally, you can reset the selected KPI data type when the module changes
    this.selectedKpiDataType = undefined;
  }
  public async signIn() : Promise<void> {
    await this._oktaAuth.signInWithRedirect();
  }

  public async signOut(): Promise<void> {
    await this._oktaAuth.signOut();
  }
}
interface User {
  _id: string;
  username: string;
  roleId: string;
}

interface Module {
  _id: string;
  courseDesc: string;
  courseName: string;
  modules: ModuleDetail[];
}

interface ModuleDetail {
  moduleId: string;
  moduleName: string;
  teamCollaboration: boolean;
  moduleAdmins: string[];
  students: string[];
  _id: string;
}
interface AssignmentDetail {
  _id: string;
  moduleId: string;
  moduleName: string;
  assignmentTitle: string;
  teamName: string;
  kpiData: {
    value: number;
    dataType: string;
    unit: string;
    timestamp: string;
    teamId: string;
  };
}