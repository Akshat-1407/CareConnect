from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    appointment_id = serializers.IntegerField(source='appointment.id', read_only=True)
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = (
            'id',
            'appointment_id',
            'doctor_name',
            'razorpay_order_id',
            'razorpay_payment_id',
            'amount',
            'currency',
            'status',
            'created_at',
            'updated_at',
        )
        read_only_fields = fields

    def get_doctor_name(self, obj):
        doc = obj.appointment.doctor
        return f"Dr. {doc.user.get_full_name() or doc.user.username}"


class VerifyPaymentSerializer(serializers.Serializer):
    razorpay_order_id = serializers.CharField(required=True)
    razorpay_payment_id = serializers.CharField(required=True)
    razorpay_signature = serializers.CharField(required=True)
