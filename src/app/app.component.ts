import { Component } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @BlockUI() blockUI: NgBlockUI;
  title: string = 'Lemonlight';
  navbarOpen: boolean = false;
  message: string;
  messages: string[] = [];

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    console.log("Starting blocking...");
    this.blockUI.start();
    setTimeout(() => {
      console.log("Finished blocking.");
      this.blockUI.stop();
    }, 2500);

    this.chatService
      .getAckResponses()
      .subscribe((message: string) => {
        console.log('Got message from server: ' + message);
        this.messages.push(message);
      });
  }

  sendMessage() {
    this.message = 'Hello, server!';
    console.log("Sending message to server: ", this.message);
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

}
