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
  connectionStarted = false;
  streaming = false;
  readonly hubConnection: HubConnection;
  readonly store: CustomStore;

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      //.withUrl("/Demos/NetCore/liveUpdateSignalRHub")
      .withUrl("/stocks")
      .build();

    this.store = new CustomStore({
      load: () => this.hubConnection.invoke("getAllStocks"),
      key: "symbol"
    });
  }

  ngOnInit() {
    this.connectionStarted = false;

    this.hubConnection
      .start()
      .then(() => {
        this.hubConnection.on("getAllStocks", (data: any) => {
          console.log(JSON.stringify(data));
          this.store.push([{ type: "update", key: data.symbol, data: data }]);
          this.startStreaming();
        });
        this.hubConnection.on("marketOpened", () => {
          this.startStreaming();
        });
        this.dataSource = this.store;
        this.connectionStarted = true;
      });
  }

  startStreaming() {
    if (this.streaming) return;

    this.streaming = true;

    this.hubConnection.stream("streamStocks").subscribe({
      complete: () => { console.log('streamStocks complete') },
      next: stock => this.displayStock(stock),
      error: function (err) {
        console.error(err);
      }
    });
  }

  displayStock(stock) {
    console.log(`streamStocks: data= ${JSON.stringify(stock)}`);
    this.store.push([{ type: "update", key: stock.symbol, data: stock }]);
  }

  openMarket() {
    this.hubConnection.invoke('openMarket');
  }

  closeMarket() {
    this.hubConnection.invoke('closeMarket');
  }
}


