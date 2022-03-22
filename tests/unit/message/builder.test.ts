import {MessageBuilder, MessageType} from "../../../src/message";
import {Host} from "../../../src/communication";


describe('MessageBuilder', () => {

    let builder : MessageBuilder;


    describe('Builder', () => {
        it('should throw ReferenceError if type is not set', () => {
            builder = new MessageBuilder();
            expect( () => builder.getMessage()).toThrow(ReferenceError);
        })

        it('should throw ReferenceError if sender is not set', () => {
            builder = new MessageBuilder();
            builder.setType(MessageType.PING);
            expect( () => builder.getMessage()).toThrow(ReferenceError);
        })

        it('should throw ReferenceError if sender is not set', () => {
            builder = new MessageBuilder();
            builder.setType(MessageType.PING);
            expect( () => builder.getMessage()).toThrow(ReferenceError);
        })
        it('Ping building', () => {
            builder = new MessageBuilder();
            builder.setType(MessageType.PING)
                    .setSender("id");
            expect( () => builder.getMessage()).toThrow(ReferenceError);
            builder.setOtherHosts([new Host("","",0)])
            expect( () => builder.getMessage()).not.toThrow(ReferenceError);
        })
        it('NewJob building', () => {
            builder = new MessageBuilder();
            builder.setType(MessageType.NEW_JOB)
                .setSender("id");
            expect( () => builder.getMessage()).toThrow(ReferenceError);
            builder.setHash("");
            expect( () => builder.getMessage()).not.toThrow(ReferenceError);
        })
        it('EndJob building', () => {
            builder = new MessageBuilder();
            builder.setType(MessageType.END_JOB)
                .setSender("id");
            expect( () => builder.getMessage()).toThrow(ReferenceError);
            builder.setHash("");
            expect( () => builder.getMessage()).toThrow(ReferenceError);
            builder.setResult("");
            expect( () => builder.getMessage()).not.toThrow(ReferenceError);
        })
        it('StartTask building', () => {
            builder = new MessageBuilder();
            builder.setType(MessageType.START_TASK)
                .setSender("id");
            expect( () => builder.getMessage()).toThrow(ReferenceError);
            builder.setHash("");
            expect( () => builder.getMessage()).toThrow(ReferenceError);
            builder.setBlockNumber(0);
            expect( () => builder.getMessage()).toThrow(ReferenceError);
            builder.setStartTime(new Date());
            expect( () => builder.getMessage()).not.toThrow(ReferenceError);
        })
        it('EndTask building', () => {
            builder = new MessageBuilder();
            builder.setType(MessageType.END_TASK)
                .setSender("id");
            expect( () => builder.getMessage()).toThrow(ReferenceError);
            builder.setHash("");
            expect( () => builder.getMessage()).toThrow(ReferenceError);
            builder.setBlockNumber(0);
            expect( () => builder.getMessage()).not.toThrow(ReferenceError);
        })

    })



})