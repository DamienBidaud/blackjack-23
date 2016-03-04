import React from "react";
import { NotificationStack } from 'react-notification';

import Deck from "./engine/Deck";
import Player from "./engine/Player";
import Game from "./engine/Game";

import PlayerZone from "./PlayerZone";

// Blackjack table
var BlackjackTable = React.createClass({
    displayName: "BlackjackTable",

    getInitialState() {
        // New game
        // Create the game engine
        return {
            game : new Game(new Deck(6), [new Player(100)]),
            notifications: []
        };
    },
    
    onBet() {
        // When multiple player, check that everybody has made a bet
        this.startTurn();
    },

    startTurn() {
        // Give cards
        this.state.game.initalDraw();

        // Refresh
        this.forceUpdate();
    },

    nextTurn() {
        // Make the dealer draw cards
        this.state.game.dealerDraw();

        // End the turn
        var results = this.state.game.endTurn();

        // Update
        this.forceUpdate();

        // Alert the user


        results.forEach(result => {

            if(result == "won")
                this.notification("You won :)");
            else if (result == "lost")
                this.notification("You lost :(");
            else if (result == "blackjack")
                this.notification("BlackJack");
            else
                this.notification("Equality :S");
        });

        setTimeout(() => {
            this.state.game.nextTurn();
            this.forceUpdate();
        }, 2500);
    },

    render() {
        const { game } = this.state;

        let playersZone = game.players.map((player, i) => {
            return (
                <PlayerZone
                    key={i}
                    type="player"
                    game={game} player={player}
                    notification={this.notification}
                    onBet={this.onBet}
                    onStand={this.nextTurn}
                    onSplit={this.forceUpdate} />
                );
        });
        
        return (
            <div>
                <PlayerZone
                    type="dealer"
                    game={game} player={game.dealer}
                    notification={this.notification} />
                {playersZone}
                <input
                    style={{
                        position: 'absolute',
                        bottom: '1px',
                        left: '15px'
                    }}
                    type="button"
                    className="button-small"
                    value="Return Menu"
                    onClick={() => {
                        window.location.replace("menu.html");
                    }}/>
                <NotificationStack
                    notifications={this.state.notifications}
                    onDismiss={notification => {
                        this.setState({
                            notifications: this.state.notifications.filter(n => n.key !== notification.key)
                        })
                    }}
                />
            </div>
        );
    },

    notification(message) {
        this.state.notifications.push({
            message: message,
            key: Math.floor((1 + Math.random()) * 0x10000).toString(16)
        });
        this.forceUpdate();
    },

    componentWillMount() {
        // First turn
        this.state.game.nextTurn();
    }
});

export default BlackjackTable;
