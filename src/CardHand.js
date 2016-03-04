import React from "react";

import CardImage from "./CardImage";

// Hand of card
var CardHand = React.createClass({
    displayName: "CardHand",

    // Ask for a new card
    hit() {
        let { game, player, hand, notification } = this.props;

        game.playerDraw(player, hand);

        // Update
        this.forceUpdate();

        if(hand.isBusted()) {
            notification("Hand broken with " + hand.getScore());
            setTimeout(() => {
                this.stand();
            }, 2000);
        }
    },

    split() {
        const { game, player, hand } = this.props;

        game.playerSplit(player, hand);

        // Callback
        this.props.onSplit();
    },

    // Pass
    stand() {
        const { hand } = this.props;

        hand.stand = true;

        // Callback
        this.props.onStand();
    },

    hasEnoughCredits() {
        const { player, hand } = this.props;
        return hand.bet <= player.credits;
    },

    double() {
        const { player, hand } = this.props;
        const currentBet = hand.bet;
        player.credits = player.credits - currentBet;
        hand.bet = hand.bet * 2;
        this.stand();
    },

    render() {
        return this.props.type === 'dealer' ? this.renderDealer() : this.renderPlayer();
    },

    renderDealer() {
        const { player, hand } = this.props;

        let cardImages = this.props.hand.cards.map(card =>
            <CardImage card={card} key={card.type + card.figure} />
        );
        let score = 0;

        if(player.stand) {
            score = hand.getScore(); 
        } else if(cardImages.length > 0) {
            score = this.props.hand.cards[0].value;

            if(score == 1)
                score = 11;

            cardImages = [cardImages[0], (<CardImage card={null} key={"back"} />)];
        }

        return (
            <div className="hand column">
                <div className="cards">
                    {cardImages}
                    {score > 0 ? (<h3 className="cardScore">{score}</h3>) : null}
                </div>
            </div>
        );
    },

    renderPlayer() {
        const { player, hand, type } = this.props;

        let cardImages = this.props.hand.cards.map(card =>
            <CardImage card={card} key={card.id} />
        );

        return (
            <div className="hand column">
                <div className="cards">
                    {cardImages}
                    {hand.getScore() > 0 ? (<h3 className="cardScore">{hand.getScore()}</h3>) : null}
                    {hand.bet > 0        ? (<h5 className="batValue">{hand.bet} credit(s)</h5>) : null}
                </div>
                <div>
                    <div className="player-controls column">
                        <input
                            type="button"
                            disabled={hand.canHit() && !hand.stand ? "" : "disabled"}
                            value="Hit"
                            onClick={this.hit} />
                        { (hand.isDoublable() && this.hasEnoughCredits() )
                        ? <input
                                type="button"
                                className="button-outline"
                                value="Double"
                                onClick={this.double} />
                        : null }
                        <input
                            type="button"
                            className="button-outline"
                            disabled={!hand.stand ? "" : "disabled"}
                            value="Stand"
                            onClick={this.stand}/>

                    { hand.isSplittable() && hand.bet <= player.credits ?
                        (<input
                            type="button"
                            disabled={!hand.stand ? "" : "disabled"}
                            className="button-outline"
                            value="Split"
                            onClick={this.split}/>)
                    : null }

                    </div>
                </div>
            </div>
        );
    }
});

export default CardHand;
