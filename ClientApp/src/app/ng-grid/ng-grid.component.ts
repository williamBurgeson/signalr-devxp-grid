import { NgModule, Component, enableProdMode, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import { DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';

@Component({
  selector: 'app-ng-grid',
  templateUrl: './ng-grid.component.html',
  styleUrls: ['./ng-grid.component.css']
})
export class NgGridComponent implements OnInit {
  dataSource: any;
  connectionStarted: boolean;
  hubConnection: HubConnection;

  constructor() { }

  ngOnInit() {
    this.connectionStarted = false;

    this.hubConnection = new HubConnectionBuilder()
      //.withUrl("/Demos/NetCore/liveUpdateSignalRHub")
      .withUrl("/stocks")
      .build();

    var store = new CustomStore({
      load: () => this.hubConnection.invoke("getAllStocks"),
      key: "symbol"
    });

    this.hubConnection
      .start()
      .then(() => {
        this.hubConnection.on("getAllStocks", (data: any) => {
          console.log(JSON.stringify(data));
          store.push([{ type: "update", key: data.symbol, data: data }]);
        });
        this.dataSource = store;
        this.connectionStarted = true;
      });
  }

  openMarket() {
    this.hubConnection.invoke('openMarket');
  }

  closeMarket() {
    this.hubConnection.invoke('closeMarket');
  }
}


